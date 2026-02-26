// Copyright 2019-2023 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Runs in the extension background, handling all keyring access

/* global chrome */

import '@polkadot/extension-inject/crossenv';

import type { RequestSignatures, TransportRequestMessage } from '@polkadot/extension-base/background/types';

import { handlers, withErrorLog } from '@polkadot/extension-base/background';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const action = (chrome as typeof chrome & { action?: typeof chrome.browserAction }).action || chrome.browserAction;
const ALLOWED_TAB_URL_SCHEMES = ['http:', 'https:', 'ipfs:', 'ipns:'];

function isAllowedTabUrl (url?: string): url is string {
  return !!url && ALLOWED_TAB_URL_SCHEMES.some((prefix) => url.startsWith(prefix));
}

// setup the notification (same a FF default background, white text)
withErrorLog(() => action.setBadgeBackgroundColor({ color: '#d90000' }));

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
  // shouldn't happen, however... only listen to what we know about
  assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);

  // message and disconnect handlers
  port.onMessage.addListener((data: TransportRequestMessage<keyof RequestSignatures>) => handlers(data, port));
  port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`));
});

function getActiveTabs () {
  // queriing the current active tab in the current window should only ever return 1 tab
  // although an array is specified here
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // include only URL schemes handled by the background state
    const urls: string[] = tabs
      .map(({ url }) => url)
      .filter(isAllowedTabUrl);

    const request: TransportRequestMessage<'pri(activeTabsUrl.update)'> = {
      id: 'background',
      message: 'pri(activeTabsUrl.update)',
      origin: 'background',
      request: { urls }
    };

    handlers(request);
  });
}

chrome.runtime.onMessage.addListener((message: { type?: string; filename?: string; jsonText?: string }, _, sendResponse) => {
  if (message.type !== 'qsb(download.json)') {
    return;
  }

  if (!chrome.downloads?.download || !message.filename || !message.jsonText) {
    sendResponse({ ok: false });

    return;
  }

  const url = `data:application/json;charset=utf-8,${encodeURIComponent(message.jsonText)}`;

  chrome.downloads.download({ filename: message.filename, saveAs: false, url }, (downloadId) => {
    sendResponse({ ok: !!downloadId && !chrome.runtime.lastError });
  });

  return true;
});

// listen to tab updates this is fired on url change
chrome.tabs.onUpdated.addListener((_, changeInfo) => {
  // we are only interested in url change
  if (!isAllowedTabUrl(changeInfo.url)) {
    return;
  }

  getActiveTabs();
});

// the list of active tab changes when switching window
// in a mutli window setup
chrome.windows.onFocusChanged.addListener(() =>
  getActiveTabs()
);

// when clicking on an existing tab or opening a new tab this will be fired
// before the url is entered by users
chrome.tabs.onActivated.addListener(() => {
  getActiveTabs();
});

// when deleting a tab this will be fired
chrome.tabs.onRemoved.addListener(() => {
  getActiveTabs();
});

// initial setup
cryptoWaitReady()
  .then((): void => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });

    console.log('initialization completed');
  })
  .catch((error): void => {
    console.error('initialization failed', error);
  });
