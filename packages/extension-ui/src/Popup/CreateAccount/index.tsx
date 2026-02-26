// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import AccountNamePasswordCreation from '../../components/AccountNamePasswordCreation.js';
import { ActionContext, Address, Dropdown, Loading } from '../../components/index.js';
import useGenesisHashOptions from '../../hooks/useGenesisHashOptions.js';
import useMetadata from '../../hooks/useMetadata.js';
import useTranslation from '../../hooks/useTranslation.js';
import { createAccountSuri, createSeed, validateSeed } from '../../messaging.js';
import { Header } from '../../partials/index.js';
import { styled } from '../../styled.js';
import { DEFAULT_TYPE } from '../../util/defaultType.js';
import Mnemonic from './Mnemonic.js';

interface Props {
  className?: string;
}

function CreateAccount ({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<null | string>(null);
  const [seed, setSeed] = useState<null | string>(null);
  const [type, setType] = useState(DEFAULT_TYPE);
  const [name, setName] = useState('');
  const options = useGenesisHashOptions();
  const [genesisHash, setGenesis] = useState<HexString | null>(null);
  const chain = useMetadata(genesisHash, true);

  useEffect((): void => {
    createSeed(undefined)
      .then(({ address, seed }): void => {
        setAddress(address);
        setSeed(seed);
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (seed) {
      const type = chain && chain.definition.chainType === 'ethereum'
        ? 'ethereum'
        : DEFAULT_TYPE;

      setType(type);
      validateSeed(seed, type)
        .then(({ address }) => setAddress(address))
        .catch(console.error);
    }
  }, [seed, chain]);

  const _onCreate = useCallback(
    (name: string, password: string): void => {
      // this should always be the case
      if (name && password && seed) {
        setIsBusy(true);

        createAccountSuri(name, password, seed, type, genesisHash)
          .then(() => onAction('/'))
          .catch((error: Error): void => {
            setIsBusy(false);
            console.error(error);
          });
      }
    },
    [genesisHash, onAction, seed, type]
  );

  const _onNextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const _onPreviousStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  const _onChangeNetwork = useCallback(
    (newGenesisHash: HexString) => setGenesis(newGenesisHash),
    []
  );

  return (
    <div className={className}>
      <Header
        showBackArrow
        text={t<string>('Create account')}
      />
      <div className='stepsBar'>
        <div className={`step ${step === 1 ? 'isActive' : 'isDone'}`}>
          <span className='index'>1</span>
          <span className='name'>{t<string>('Save seed')}</span>
        </div>
        <div className='divider' />
        <div className={`step ${step === 2 ? 'isActive' : ''}`}>
          <span className='index'>2</span>
          <span className='name'>{t<string>('Create account')}</span>
        </div>
      </div>
      <Loading>
        <div>
          <Address
            address={address}
            genesisHash={genesisHash}
            name={name}
          />
        </div>
        {seed && (
          step === 1
            ? (
              <Mnemonic
                onNextStep={_onNextStep}
                seed={seed}
              />
            )
            : (
              <>
                <Dropdown
                  className='networkDropdown'
                  label={t<string>('Network')}
                  onChange={_onChangeNetwork}
                  options={options}
                  value={genesisHash}
                />
                <AccountNamePasswordCreation
                  buttonLabel={t<string>('Add the account')}
                  isBusy={isBusy}
                  onBackClick={_onPreviousStep}
                  onCreate={_onCreate}
                  onNameChange={setName}
                />
              </>
            )
        )}
      </Loading>
    </div>
  );
}

export default styled(CreateAccount)(({ theme }) => `
  height: 100%;
  margin-bottom: 16px;

  .stepsBar {
    align-items: center;
    display: flex;
    gap: 10px;
    margin: -8px 0 14px;
    padding: 0 2px;
  }

  .step {
    align-items: center;
    color: ${theme.labelColor};
    display: inline-flex;
    gap: 6px;
    opacity: 0.75;
  }

  .step .index {
    align-items: center;
    border: 1px solid ${theme.inputBorderColor};
    border-radius: 999px;
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    height: 18px;
    justify-content: center;
    width: 18px;
  }

  .step .name {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .step.isActive,
  .step.isDone {
    color: ${theme.primaryColor};
    opacity: 1;
  }

  .step.isActive .index,
  .step.isDone .index {
    background: ${theme.primaryColor};
    border-color: ${theme.primaryColor};
    color: ${theme.buttonTextColor};
  }

  .divider {
    background: ${theme.inputBorderColor};
    height: 1px;
    min-width: 28px;
  }

  .networkDropdown label::after {
    right: 36px;
  }
`);
