// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RouteComponentProps } from 'react-router';
import type { ThemeProps } from '../../types.js';

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { withRouter } from 'react-router';

import BoxWithLabel from '../../components/BoxWithLabel.js';
import { ActionBar, ActionContext, ActionText, Button, InputWithLabel, Warning } from '../../components/index.js';
import useTranslation from '../../hooks/useTranslation.js';
import { exportDid } from '../../messaging.js';
import { Header } from '../../partials/index.js';
import { styled } from '../../styled.js';
import { downloadJson } from '../../util/downloadJson.js';

const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{ did: string }>, ThemeProps {
  className?: string;
}

function ExportDid ({ className, match: { params: { did } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const normalizedDid = useMemo(() => decodeURIComponent(did), [did]);

  const _goHome = useCallback(
    () => onAction('/'),
    [onAction]
  );

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');
    },
    []
  );

  const _onExportButtonClick = useCallback(
    (): void => {
      setIsBusy(true);

      exportDid(normalizedDid, pass)
        .then(({ exportedJson }) => {
          downloadJson(exportedJson, `${normalizedDid}.json`);

          window.localStorage.setItem('accounts_active_tab', 'dids');
          onAction('/');
        })
        .catch((error: Error) => {
          console.error(error);
          setError(error.message);
          setIsBusy(false);
        });
    },
    [normalizedDid, onAction, pass]
  );

  return (
    <>
      <Header
        showBackArrow
        text={t<string>('Download DID')}
      />
      <div className={className}>
        <BoxWithLabel
          label={t<string>('DID')}
          value={normalizedDid}
        />
        <Warning className='movedWarning'>
          {t<string>('This file contains your encrypted DID key. Keep it safe and do not share it.')}
        </Warning>
        <div className='actionArea'>
          <InputWithLabel
            data-export-password
            disabled={isBusy}
            isError={pass.length < MIN_LENGTH || !!error}
            label={t<string>('password for this DID')}
            onChange={onPassChange}
            type='password'
          />
          {error && (
            <Warning
              isBelowInput
              isDanger
            >
              {error}
            </Warning>
          )}
          <Button
            className='export-button'
            data-export-button
            isBusy={isBusy}
            isDanger
            isDisabled={pass.length === 0 || !!error}
            onClick={_onExportButtonClick}
          >
            {t<string>('Download DID file')}
          </Button>
          <ActionBar className='withMarginTop'>
            <ActionText
              className='center'
              onClick={_goHome}
              text={t<string>('Cancel')}
            />
          </ActionBar>
        </div>
      </div>
    </>
  );
}

export default withRouter(styled(ExportDid)`
  .actionArea {
    padding: 10px 24px;
  }

  .center {
    margin: auto;
  }

  .export-button {
    margin-top: 6px;
  }

  .movedWarning {
    margin-top: 8px;
  }

  .withMarginTop {
    margin-top: 4px;
  }
`);
