// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Theme, ThemeProps } from '../types.js';

import { faExpand, faTasks } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext } from 'styled-components';

import settings from '@polkadot/ui-settings';

import { ActionContext, ActionText, Checkbox, Menu, MenuDivider, MenuItem, Svg, Switch, themes, ThemeSwitchContext } from '../components/index.js';
import useIsPopup from '../hooks/useIsPopup.js';
import useTranslation from '../hooks/useTranslation.js';
import { setNotification, windowOpen } from '../messaging.js';
import { styled } from '../styled.js';
import getLanguageOptions from '../util/getLanguageOptions.js';

interface Props extends ThemeProps {
  className?: string;
  reference: React.MutableRefObject<null>;
}

const notificationOptions = ['Extension', 'PopUp', 'Window']
  .map((item) => ({ text: item, value: item.toLowerCase() }));

function MenuSettings ({ className, reference }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [camera, setCamera] = useState(settings.camera === 'on');
  const [notification, updateNotification] = useState(settings.notification);
  const themeContext = useContext(ThemeContext as React.Context<Theme>);
  const setTheme = useContext(ThemeSwitchContext);
  const isPopup = useIsPopup();
  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const onAction = useContext(ActionContext);

  useEffect(() => {
    settings.set({ camera: camera ? 'on' : 'off' });
  }, [camera]);

  const _onChangeNotification = useCallback(
    (value: string): void => {
      setNotification(value).catch(console.error);

      updateNotification(value);
      settings.set({ notification: value });
    }, []
  );

  const _onChangeTheme = useCallback(
    (checked: boolean): void => setTheme(checked ? 'dark' : 'light'),
    [setTheme]
  );

  const _onWindowOpen = useCallback(
    (): void => {
      windowOpen('/').catch(console.error);
    }, []
  );

  const _onChangeLang = useCallback(
    (value: number | string): void => {
      settings.set({ i18nLang: String(value) });
      setIsLangOpen(false);
    }, []
  );

  const _onToggleLang = useCallback(() => {
    setIsLangOpen((open) => !open);
    setIsNotificationOpen(false);
  }, []);

  const _onToggleNotification = useCallback(() => {
    setIsNotificationOpen((open) => !open);
    setIsLangOpen(false);
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent): void => {
      const target = event.target as Node;

      if (isLangOpen && languageRef.current && !languageRef.current.contains(target)) {
        setIsLangOpen(false);
      }

      if (isNotificationOpen && notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [isLangOpen, isNotificationOpen]);

  const langValueLabel = useMemo(
    () => languageOptions.find(({ value }) => value === settings.i18nLang)?.text || settings.i18nLang,
    [languageOptions]
  );

  const notificationValueLabel = useMemo(
    () => notificationOptions.find(({ value }) => value === notification)?.text || notification,
    [notification]
  );

  const _goToAuthList = useCallback(
    () => {
      onAction('auth-list');
    }, [onAction]
  );

  return (
    <Menu
      className={className}
      reference={reference}
    >
      <MenuItem
        className='setting'
        title='Theme'
      >
        <Switch
          checked={themeContext.id === themes.dark.id}
          checkedLabel={t<string>('Dark')}
          onChange={_onChangeTheme}
          uncheckedLabel={t<string>('Light')}
        />
      </MenuItem>
      <MenuItem
        className='setting'
        title={t<string>('Language')}
      >
        <div
          className='dropdown customDropdown'
          ref={languageRef}
        >
          <button
            className='dropdownTrigger'
            onClick={_onToggleLang}
            type='button'
          >
            <span>{langValueLabel}</span>
            <span className='arrow'>▼</span>
          </button>
          {isLangOpen && (
            <div className='dropdownList'>
              {languageOptions.map(({ text, value }) => (
                <button
                  className={`dropdownOption ${value === settings.i18nLang ? 'isSelected' : ''}`}
                  key={value}
                  onClick={() => _onChangeLang(value)}
                  type='button'
                >
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>
      </MenuItem>
      <MenuItem
        className='setting'
        title={t<string>('Notifications')}
      >
        <div
          className='dropdown customDropdown'
          ref={notificationRef}
        >
          <button
            className='dropdownTrigger'
            onClick={_onToggleNotification}
            type='button'
          >
            <span>{notificationValueLabel}</span>
            <span className='arrow'>▼</span>
          </button>
          {isNotificationOpen && (
            <div className='dropdownList'>
              {notificationOptions.map(({ text, value }) => (
                <button
                  className={`dropdownOption ${value === notification ? 'isSelected' : ''}`}
                  key={value}
                  onClick={() => _onChangeNotification(value)}
                  type='button'
                >
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>
      </MenuItem>
      <MenuItem
        className='setting'
        title={t<string>('External accounts and Access')}
      >
        <Checkbox
          checked={camera}
          className='checkbox camera'
          label={t<string>('Allow QR Camera Access')}
          onChange={setCamera}
        />
      </MenuItem>
      <MenuDivider />
      <MenuItem className='setting'>
        <ActionText
          className='manageWebsiteAccess'
          icon={faTasks}
          onClick={_goToAuthList}
          text={t<string>('Manage Website Access')}
        />
      </MenuItem>
      {isPopup && (
        <MenuItem className='setting'>
          <ActionText
            className='openWindow'
            icon={faExpand}
            onClick={_onWindowOpen}
            text={t<string>('Open extension in new window')}
          />
        </MenuItem>
      )}
    </Menu>
  );
}

export default React.memo(styled(MenuSettings)(({ theme }: Props) => `
  margin-top: 50px;
  right: 24px !important;
  transform: none !important;
  user-select: none;

  .openWindow, .manageWebsiteAccess{
    span {
      color: ${theme.textColor};
      font-size: ${theme.fontSize};
      line-height: ${theme.lineHeight};
      text-decoration: none;
      vertical-align: middle;
    }

    ${Svg} {
      background: ${theme.textColor};
      height: 20px;
      top: 4px;
      width: 20px;
    }
  }

  > .setting {
    > .checkbox {
      color: ${theme.textColor};
      line-height: 20px;
      font-size: 15px;
      margin-bottom: 0;

      &.ledger {
        margin-top: 0.2rem;
      }

      label {
        color: ${theme.textColor};
      }
    }

    > .dropdown {
      background: ${theme.background};
      margin-bottom: 0;
      margin-top: 9px;
      margin-right: 0;
      width: 100%;
    }
  }

  .customDropdown {
    position: relative;
  }

  .dropdownTrigger {
    align-items: center;
    background: ${theme.readonlyInputBackground};
    border: 1px solid ${theme.inputBorderColor};
    border-radius: ${theme.borderRadius};
    color: ${theme.textColor};
    cursor: pointer;
    display: flex;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    text-align: left;
    width: 100%;
  }

  .dropdownTrigger .arrow {
    color: ${theme.iconNeutralColor};
    font-size: 11px;
    line-height: 1;
  }

  .dropdownList {
    background: ${theme.readonlyInputBackground};
    border: 1px solid ${theme.inputBorderColor};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.cardShadow};
    left: 0;
    margin-top: 4px;
    max-height: 220px;
    overflow-y: auto;
    position: absolute;
    right: 0;
    z-index: ${theme.zIndexDropdown};
  }

  .dropdownOption {
    background: transparent;
    border: 0;
    color: ${theme.textColor};
    cursor: pointer;
    display: block;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    padding: 0.4rem 0.6rem;
    text-align: left;
    width: 100%;

    &.isSelected {
      background: ${theme.highlightedAreaBackground};
    }

    &:hover {
      background: ${theme.highlightedAreaBackground};
    }
  }
`));
