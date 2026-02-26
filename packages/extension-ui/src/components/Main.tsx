// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import React from 'react';

import { styled } from '../styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function Main ({ children, className }: Props): React.ReactElement<Props> {
  return (
    <main className={className}>
      {children}
    </main>
  );
}

export default styled(Main)(({ theme }: ThemeProps) => `
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${theme.background};
  color: ${theme.textColor};
  font-size: ${theme.fontSize};
  line-height: ${theme.lineHeight};
  border: ${theme.id === 'light' ? 'none' : `1px solid ${theme.inputBorderColor}`};
  border-radius: ${theme.id === 'light' ? '0' : theme.borderRadiusLarge};
  box-shadow: ${theme.id === 'light' ? 'none' : `0 14px 32px ${theme.boxShadow}`};
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(100% 70% at 100% 0%, ${theme.warningBackground}, transparent 55%);
  }

  * {
    font-family: ${theme.fontFamily};
  }

  > * {
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
  }
`);
