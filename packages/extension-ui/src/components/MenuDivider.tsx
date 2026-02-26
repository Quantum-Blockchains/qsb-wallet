// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types.js';

import React from 'react';

import { styled } from '../styled.js';

interface Props extends ThemeProps {
  className?: string;
}

function MenuDivider ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className} />
  );
}

export default styled(MenuDivider)(({ theme }: Props) => `
  padding-top: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${theme.id === 'dark' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(107, 127, 162, 0.35)'};
`);
