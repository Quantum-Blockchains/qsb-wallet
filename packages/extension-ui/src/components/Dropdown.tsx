// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import React, { useCallback } from 'react';

import { styled } from '../styled.js';
import Label from './Label.js';

interface DropdownOption {
  text: string;
  value: string;
}

interface Props extends ThemeProps {
  className?: string;
  defaultValue?: string | null;
  isDisabled?: boolean
  isError?: boolean;
  isFocussed?: boolean;
  label: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  value?: string;
}

function Dropdown ({ className, defaultValue, isDisabled, isFocussed, label, onBlur, onChange, options, value }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) =>
      onChange && onChange(value.trim()),
    [onChange]
  );

  return (
    <>
      <Label
        className={className}
        label={label}
      >
        <select
          autoFocus={isFocussed}
          defaultValue={defaultValue || undefined}
          disabled={isDisabled}
          onBlur={onBlur}
          onChange={_onChange}
          value={value}
        >
          {options.map(({ text, value }): React.ReactNode => (
            <option
              key={value}
              value={value}
            >
              {text}
            </option>
          ))}
        </select>
      </Label>
    </>
  );
}

export default React.memo(styled(Dropdown)(({ isError, label, theme }: Props) => `
  position: relative;
  --select-menu-bg: ${theme.readonlyInputBackground};
  --select-menu-selected-bg: ${theme.highlightedAreaBackground};

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: ${theme.readonlyInputBackground};
    border-color: ${isError ? theme.errorBorderColor : theme.inputBorderColor};
    border-radius: ${theme.borderRadius};
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    color: ${isError ? theme.errorBorderColor : theme.textColor};
    display: block;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    padding: 0.5rem 0.75rem;
    width: 100%;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus-visible {
      border-color: ${theme.primaryColor};
      box-shadow: ${theme.focusRing};
      outline: none;
    }

    &:read-only {
      box-shadow: none;
      outline: none;
    }

    option {
      background: var(--select-menu-bg);
      color: ${theme.textColor};
    }

    option:checked {
      background: var(--select-menu-selected-bg);
      color: ${theme.textColor};
    }
  }

  label::after {
    content: '';
    position: absolute;
    top: ${label ? 'calc(50% + 14px)' : '50%'};
    transform: translateY(-50%);
    right: 14px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid ${theme.iconNeutralColor};
    pointer-events: none;
  }
`));
