// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidRecord } from '@polkadot/extension-base/background/types';
import type { ThemeProps } from '../../types.js';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { ActionContext, Button, Checkbox, Warning } from '../../components/index.js';
import { getSurfaceCardStyles } from '../../components/cardStyles.js';
import useTranslation from '../../hooks/useTranslation.js';
import { didsList, getAuthList, updateAuthorization } from '../../messaging.js';
import { Header } from '../../partials/index.js';
import { styled } from '../../styled.js';

interface Props extends ThemeProps {
  className?: string;
}

function DidManagement ({ className }: Props): React.ReactElement<Props> {
  const { url } = useParams<{url: string}>();
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [dids, setDids] = useState<DidRecord[]>([]);
  const [selectedDids, setSelectedDids] = useState<string[]>([]);
  const [authorizedAccounts, setAuthorizedAccounts] = useState<string[]>([]);
  const [savedAuthorizedDids, setSavedAuthorizedDids] = useState<string[] | undefined>(undefined);
  const didIds = useMemo(() => dids.map((item) => item.did), [dids]);
  const noDidSelected = useMemo(() => selectedDids.length === 0, [selectedDids.length]);
  const areAllDidsSelected = useMemo(
    () => selectedDids.length === didIds.length,
    [didIds.length, selectedDids.length]
  );
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  useEffect(() => {
    getAuthList()
      .then(({ list }) => {
        if (!list[url]) {
          return;
        }

        setAuthorizedAccounts(list[url].authorizedAccounts || []);
        setSavedAuthorizedDids(list[url].authorizedDids);
      })
      .catch(console.error);
  }, [url]);

  useEffect(() => {
    didsList()
      .then(setDids)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!dids.length) {
      return;
    }

    if (savedAuthorizedDids === undefined) {
      setSelectedDids(dids.map((item) => item.did));
    } else {
      setSelectedDids(savedAuthorizedDids.filter((did) => didIds.includes(did)));
    }
  }, [dids, didIds, savedAuthorizedDids]);

  useEffect(() => {
    const nextIndeterminateState = !noDidSelected && !areAllDidsSelected;

    setIsIndeterminate(nextIndeterminateState);
  }, [areAllDidsSelected, noDidSelected]);

  const _onSelectAllDids = (): void => {
    if (areAllDidsSelected) {
      setSelectedDids([]);

      return;
    }

    setSelectedDids(didIds);
  };

  const _onToggleDid = (did: string): void => {
    setSelectedDids((current) =>
      current.includes(did)
        ? current.filter((item) => item !== did)
        : [...current, did]
    );
  };

  const _onApprove = useCallback(
    (): void => {
      updateAuthorization(authorizedAccounts, url, selectedDids)
        .then(() => onAction('../index.js'))
        .catch(console.error);
    },
    [authorizedAccounts, onAction, selectedDids, url]
  );

  return (
    <>
      <Header
        showBackArrow
        smallMargin={true}
        text={t<string>('DIDs connected to {{url}}', { replace: { url } })}
      />
      <div className={className}>
        {dids.length === 0
          ? (
            <Warning className='didWarning'>
              {t<string>('No DIDs found in your wallet.')}
            </Warning>
          )
          : (
            <>
              <Checkbox
                checked={areAllDidsSelected}
                className='did-checkbox'
                indeterminate={isIndeterminate}
                label={t<string>('Select all DIDs')}
                onChange={_onSelectAllDids}
              />
              <div className='didList'>
                {dids.map(({ did, name }) => (
                  <div
                    className='didWithCheckbox'
                    key={did}
                  >
                    <Checkbox
                      checked={selectedDids.includes(did)}
                      className='did-checkbox'
                      label=''
                      onChange={() => _onToggleDid(did)}
                    />
                    <div className='didItem'>
                      <div className='didRow'>
                        <div
                          aria-hidden='true'
                          className='didIcon'
                        >
                          <span>ID</span>
                        </div>
                        <div className='didBody'>
                          <div className='didName'>{name || t<string>('DID')}</div>
                          <div className='didValue'>{did}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        <Button
          className='acceptButton'
          onClick={_onApprove}
        >
          {t<string>('Connect {{total}} DID(s)', { replace: {
            total: selectedDids.length
          } })}
        </Button>
      </div>
    </>
  );
}

export default styled(DidManagement)(({ theme }: Props) => `
  .didList {
    height: 360px;
    overflow-y: auto;
    margin-top: 6px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .didItem {
    ${getSurfaceCardStyles(theme)}
    background: ${theme.boxBackground};
    min-height: 72px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 0;
    flex: 1;
  }

  .didWithCheckbox {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
    min-width: 0;
  }

  .didWithCheckbox > .didItem {
    width: 100%;
    min-width: 0;
  }

  .didRow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .didBody {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .didName {
    color: ${theme.textColor};
    font-size: ${theme.fontSizeLg};
    line-height: ${theme.lineHeightLg};
    font-weight: 600;
  }

  .didValue {
    color: ${theme.labelColor};
    font-size: ${theme.fontSizeSm};
    line-height: ${theme.lineHeightXs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .didIcon {
    width: 50px;
    height: 50px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.primaryColor};
    color: ${theme.buttonTextColor};
    font-size: 16px;
    font-weight: 700;
    flex: 0 0 50px;
  }

  .didWithCheckbox > .did-checkbox {
    display: inline-block;
    width: 18px;
    min-width: 18px;
    margin: 0;

    label {
      display: block;
      width: 18px;
      height: 16px;
      line-height: 16px;
      padding-left: 18px;
      padding-top: 0;
      font-size: 0;
    }

    label span {
      top: 0;
    }
  }

  .didWarning {
    margin: 6px 0;
  }

  .acceptButton {
    width: 90%;
    margin: 0.5rem auto 0;
  }
`);
