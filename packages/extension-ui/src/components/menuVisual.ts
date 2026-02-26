// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Theme } from '../types.js';

interface MenuVisualConfig {
  border: string;
  fallbackBg: string;
  glassBg: string;
}

export function getMenuVisualConfig (theme: Theme): MenuVisualConfig {
  return theme.id === 'dark'
    ? {
      border: 'rgba(148, 163, 184, 0.45)',
      fallbackBg: 'rgba(10, 18, 36, 0.78)',
      glassBg: 'rgba(10, 18, 36, 0.72)'
    }
    : {
      border: 'rgba(150, 171, 206, 0.42)',
      fallbackBg: 'rgba(248, 252, 255, 0.94)',
      glassBg: 'rgba(246, 251, 255, 0.86)'
    };
}
