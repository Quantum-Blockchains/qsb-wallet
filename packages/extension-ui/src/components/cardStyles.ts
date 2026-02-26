// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Theme } from '../types.js';

export function getSurfaceCardStyles (theme: Theme): string {
  return `
    background: ${theme.boxBackground};
    border: 1px solid ${theme.boxBorderColor};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.cardShadow};
    transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

    &:hover {
      border-color: ${theme.inputBorderColor};
      transform: translateY(-1px);
    }
  `;
}
