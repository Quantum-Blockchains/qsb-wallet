// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types.js';

import React, { useCallback, useRef, useState } from 'react';

import { Address } from '../../components/index.js';
import useOutsideClick from '../../hooks/useOutsideClick.js';
import { styled } from '../../styled.js';

interface Props {
  allAddresses: [string, string | null][];
  className?: string;
  onSelect: (address: string) => void;
  selectedAddress: string;
  selectedGenesis: string | null;
}

function AddressDropdown ({ allAddresses, className, onSelect, selectedAddress, selectedGenesis }: Props): React.ReactElement<Props> {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const _hideDropdown = useCallback(() => setDropdownVisible(false), []);
  const _toggleDropdown = useCallback(() => setDropdownVisible(!isDropdownVisible), [isDropdownVisible]);
  const _selectParent = useCallback((newParent: string) => () => onSelect(newParent), [onSelect]);

  useOutsideClick([ref], _hideDropdown);

  return (
    <div className={className}>
      <div
        onClick={_toggleDropdown}
        ref={ref}
      >
        <Address
          address={selectedAddress}
          className='address'
          genesisHash={selectedGenesis}
        />
      </div>
      <div className={`dropdown ${isDropdownVisible ? 'visible' : ''}`}>
        {allAddresses.map(([address, genesisHash]) => (
          <div
            data-parent-option
            key={address}
            onClick={_selectParent(address)}
          >
            <Address
              address={address}
              className='address'
              genesisHash={genesisHash}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default styled(AddressDropdown)(({ theme }: ThemeProps) => `
  margin-bottom: 16px;
  cursor: pointer;

  & > div:first-child > .address::after {
    content: '';
    position: absolute;
    top: 58%;
    transform: translateY(-50%);
    right: 13px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid ${theme.iconNeutralColor};
    pointer-events: none;
  }

  .address .copyIcon {
    visibility: hidden;
  }

  .dropdown {
    position: absolute;
    visibility: hidden;
    width: 510px;
    z-index: 100;
    background: ${theme.bodyColor};
    max-height: 0;
    overflow: auto;
    padding: 5px;
    border: 1px solid ${theme.boxBorderColor};
    box-sizing: border-box;
    border-radius: ${theme.borderRadius};
    margin-top: -8px;
    box-shadow: 0 10px 24px ${theme.boxShadow};

    &.visible{
      visibility: visible;
      max-height: 200px;
    }

    & > div {
      cursor: pointer;
    }
  }
`);
