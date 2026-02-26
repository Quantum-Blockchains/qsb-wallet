// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global chrome */

export function downloadJson (data: unknown, filename: string): void {
  const isLinux = typeof navigator !== 'undefined' && /Linux/i.test(navigator.userAgent);
  const jsonText = JSON.stringify(data, null, 2);
  const fallbackDownload = (): void => {
    const blob = new Blob([jsonText], { type: 'application/json; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Chrome on Linux/Wayland may crash when extension popup triggers a download.
  // In this environment route download through background instead of popup context.
  if (isLinux && typeof chrome !== 'undefined' && !!chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ filename, jsonText, type: 'qsb(download.json)' }, (response?: { ok?: boolean }) => {
      if (chrome.runtime.lastError || !response?.ok) {
        fallbackDownload();
      }
    });

    return;
  }

  const blob = new Blob([jsonText], { type: 'application/json; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const canUseChromeDownloads = typeof chrome !== 'undefined' && !!chrome.downloads?.download;

  if (canUseChromeDownloads) {
    // On some Linux/Wayland setups, opening Save As from extension popup can crash the browser.
    // Use direct download to the default downloads folder to avoid the dialog.
    chrome.downloads.download({ filename, saveAs: false, url }, (downloadId) => {
      if (chrome.runtime.lastError || downloadId === undefined) {
        fallbackDownload();

        return;
      }

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    return;
  }

  fallbackDownload();
}
