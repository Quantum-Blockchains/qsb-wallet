// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import React from 'react';

import { getMenuVisualConfig } from './menuVisual.js';
import { styled } from '../styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
  reference: React.RefObject<HTMLDivElement>;
}

function Menu ({ children, className, reference }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      ref={reference}
    >
      {children}
    </div>
  );
}

export default styled(Menu)(({ theme }: ThemeProps) => {
  const visual = getMenuVisualConfig(theme);

  return `
  background: ${visual.glassBg};
  border-radius: 12px;
  border: 1px solid ${visual.border};
  box-sizing: border-box;
  box-shadow: ${theme.cardShadow};
  backdrop-filter: blur(12px) saturate(125%);
  -webkit-backdrop-filter: blur(12px) saturate(125%);
  margin-top: 60px;
  padding: 12px 0;
  position: absolute;
  right: 0;
  z-index: ${theme.zIndexMenu};

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background: ${visual.fallbackBg};
  }
`;
});
