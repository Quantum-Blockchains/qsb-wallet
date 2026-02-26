// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import { faArrowLeft, faCog, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import logo from '../assets/wallet.svg';
import { ActionContext, Menu } from '../components/index.js';
import InputFilter from '../components/InputFilter.js';
import Link from '../components/Link.js';
import useOutsideClick from '../hooks/useOutsideClick.js';
import useTranslation from '../hooks/useTranslation.js';
import { getConnectedTabsUrl } from '../messaging.js';
import { styled } from '../styled.js';
import MenuAdd from './MenuAdd.js';
import MenuSettings from './MenuSettings.js';

interface Props extends ThemeProps {
  addMenuItems?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  connectedPathMulti?: string;
  connectedPathSingle?: string;
  onFilter?: (filter: string) => void;
  showAdd?: boolean;
  showBackArrow?: boolean;
  showConnectedAccounts?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  smallMargin?: boolean;
  text?: React.ReactNode;
}

function Header ({ addMenuItems, children, className = '', connectedPathMulti, connectedPathSingle, onFilter, showAdd, showBackArrow, showConnectedAccounts, showSearch, showSettings, smallMargin = false, text }: Props): React.ReactElement<Props> {
  const [isAddOpen, setShowAdd] = useState(false);
  const [isSettingsOpen, setShowSettings] = useState(false);
  const [isSearchOpen, setShowSearch] = useState(false);
  const [filter, setFilter] = useState('');
  const [connectedTabsUrl, setConnectedTabsUrl] = useState<string[]>([]);
  const { t } = useTranslation();
  const addIconRef = useRef(null);
  const addMenuRef = useRef(null);
  const setIconRef = useRef(null);
  const setMenuRef = useRef(null);
  const isConnected = useMemo(() => connectedTabsUrl.length >= 1
    , [connectedTabsUrl]);
  const onAction = useContext(ActionContext);

  useEffect(() => {
    if (!showConnectedAccounts) {
      return;
    }

    getConnectedTabsUrl()
      .then((tabsUrl) => setConnectedTabsUrl(tabsUrl))
      .catch(console.error);
  }, [showConnectedAccounts]);

  useOutsideClick([addIconRef, addMenuRef], (): void => {
    isAddOpen && setShowAdd(!isAddOpen);
  });

  useOutsideClick([setIconRef, setMenuRef], (): void => {
    isSettingsOpen && setShowSettings(!isSettingsOpen);
  });

  const _toggleAdd = useCallback(
    () => setShowAdd((isAddOpen) => !isAddOpen),
    []
  );

  const _toggleSettings = useCallback(
    () => setShowSettings((isSettingsOpen) => !isSettingsOpen),
    []
  );

  const _onChangeFilter = useCallback(
    (filter: string) => {
      setFilter(filter);
      onFilter && onFilter(filter);
    },
    [onFilter]
  );

  const _toggleSearch = useCallback(
    (): void => {
      if (isSearchOpen) {
        _onChangeFilter('');
      }

      setShowSearch((isSearchOpen) => !isSearchOpen);
    },
    [_onChangeFilter, isSearchOpen]
  );

  const _onBackArrowClick = useCallback(
    () => onAction('../index.js')
    , [onAction]);

  const connectedSingleBase = connectedPathSingle || '/url/manage';
  const connectedMultiPath = connectedPathMulti || '/auth-list';
  const showConnectionBadge = showConnectedAccounts && !!isConnected && !isSearchOpen;
  const showSearchContainer = !!showSearch || !!showConnectedAccounts;

  return (
    <div className={`${className} ${smallMargin ? 'smallMargin' : ''}`}>
      <div className='container'>
        <div className='branding'>
          {showBackArrow
            ? (
              <FontAwesomeIcon
                className='arrowLeftIcon'
                icon={faArrowLeft}
                onClick={_onBackArrowClick}
              />
            )
            : (
              <img
                className='logo'
                src={logo}
              />
            )
          }
          <span className='logoText'>{text || 'qsb-extension'}</span>
        </div>
        {showSearchContainer && (
          <div className={`searchBarWrapper ${isSearchOpen ? 'selected' : ''}`}>
            {showConnectionBadge && (
              <div className='connectedAccountsWrapper'>
                <Link
                  className='connectedAccounts'
                  to={connectedTabsUrl.length === 1 ? `${connectedSingleBase}/${connectedTabsUrl[0]}` : connectedMultiPath}
                >
                  <span className='greenDot'>•</span>Connected
                </Link>
              </div>
            )}
            {showSearch && isSearchOpen && (
              <InputFilter
                className='inputFilter'
                onChange={_onChangeFilter}
                placeholder={t<string>('Search by name or network...')}
                value={filter}
                withReset
              />
            )}
          </div>
        )}
        <div className='popupMenus'>
          {showSearch && (
            <div
              className='popupToggle searchToggle'
              onClick={_toggleSearch}
            >
              <FontAwesomeIcon
                className={`searchIcon ${isSearchOpen ? 'selected' : ''}`}
                icon={faSearch}
              />
            </div>
          )}
          {showAdd && (
            <div
              className='popupToggle'
              onClick={_toggleAdd}
              ref={addIconRef}
            >
              <FontAwesomeIcon
                className={`plusIcon ${isAddOpen ? 'selected' : ''}`}
                icon={faPlusCircle}
              />
            </div>
          )}
          {showSettings && (
            <div
              className='popupToggle'
              data-toggle-settings
              onClick={_toggleSettings}
              ref={setIconRef}
            >
              <FontAwesomeIcon
                className={`cogIcon ${isSettingsOpen ? 'selected' : ''}`}
                icon={faCog}
              />
            </div>
          )}
        </div>
        {isAddOpen && (
          addMenuItems
            ? (
              <Menu
                className='customAddMenu'
                reference={addMenuRef}
              >
                {addMenuItems}
              </Menu>
            )
            : (
              <MenuAdd reference={addMenuRef} />
            )
        )}
        {isSettingsOpen && (
          <MenuSettings reference={setMenuRef} />
        )}
        {children}
      </div>
    </div>
  );
}

export default React.memo(styled(Header)(({ theme }: Props) => `
  max-width: 100%;
  box-sizing: border-box;
  font-weight: normal;
  margin: 0;
  position: relative;
  z-index: ${theme.zIndexHeader};
  margin-bottom: 20px;

  && {
    padding: 0 0 0;
  }

  > .container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid ${theme.inputBorderColor};
    min-height: 72px;
    background: ${theme.background};
    position: relative;
    z-index: ${theme.zIndexHeader};

    .branding {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      color: ${theme.labelColor};
      font-family: ${theme.fontFamily};
      text-align: center;
      margin-left: ${theme.space5};

      .logo {
        height: 28px;
        width: 28px;
        margin: 0;
        display: block;
      }

      .logoText {
        color: ${theme.textColor};
        font-family: ${theme.fontFamily};
        font-size: 19px;
        font-weight: 700;
        line-height: 24px;
        letter-spacing: 0.02em;
      }
    }

    .popupMenus, .searchBarWrapper {
      align-self: center;
    }

    .connectedAccountsWrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .connectedAccounts {
      border: 1px solid ${theme.inputBorderColor};
      border-radius: 999px;
      padding: 1px 0.65rem;
      background: ${theme.readonlyInputBackground};
      color: ${theme.subTextColor};
      font-size: 12px;

      .greenDot {
        margin-right: 0.3rem;
        font-size: 1.5rem;
        color: ${theme.connectedDotColor};
        padding-bottom: 0.2rem;
      }
    }

    .searchBarWrapper {
      flex: 1;
      display: flex;
      justify-content: end;
      align-items: center;
      padding-right: 0;

      .searchIcon {
        height: 14px;
        width: 14px;
        padding: 0;
        display: block;
      }
    }

    .popupToggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      height: 28px;
      width: 28px;
      transition: background 0.15s ease;

      &:hover {
        cursor: pointer;
        background: ${theme.highlightedAreaBackground};
      }
    }

    .inputFilter {
      width: 100%
    }

    .popupMenus {
      display: inline-flex;
      align-items: center;
      gap: ${theme.space2};
      margin-right: ${theme.space2};
    }

    .customAddMenu {
      margin-top: 50px;
      right: 24px !important;
      transform: none !important;
      min-width: 200px;
      user-select: none;
      z-index: ${theme.zIndexMenu};
    }

    .customAddMenu .menuItem {
      span:first-child {
        height: 20px;
        margin-right: 8px;
        opacity: 0.5;
        width: 20px;
      }

      span {
        vertical-align: middle;
      }

      .svg-inline--fa {
        color: ${theme.iconNeutralColor};
        margin-right: 0.3rem;
        width: 0.875em;
      }
    }
  }

  .plusIcon, .cogIcon, .searchIcon {
    color: ${theme.iconNeutralColor};
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    display: block;

    &.selected {
      color: ${theme.primaryColor};
      background: ${theme.highlightedAreaBackground};
    }
  }

  .arrowLeftIcon {
    color: ${theme.labelColor};
    margin-right: 1rem;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: ${theme.primaryColor};
    }
  }

  &.smallMargin {
    margin-bottom: 15px;
  }
`));
