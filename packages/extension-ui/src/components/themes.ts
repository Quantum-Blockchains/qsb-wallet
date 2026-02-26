// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

const darkTheme = {
  accountDotsIconColor: '#7484a3',
  addAccountImageBackground: '#0d1422',
  backButtonBackground: '#121b2f',
  backButtonBackgroundHover: '#172340',
  backButtonTextColor: '#dce8ff',
  background: '#0f172a',
  bodyColor: '#090f1e',
  borderRadius: '10px',
  borderRadiusLarge: '12px',
  borderRadiusPill: '999px',
  boxBackground: '#0d1422',
  boxBorderColor: '#21314f',
  boxLineHeight: '1rem',
  boxMargin: '0.75rem 0',
  boxPadding: '0.25rem 0.5rem',
  boxShadow: 'rgba(2, 6, 23, 0.45)',
  cardShadow: '0 6px 16px rgba(2, 6, 23, 0.45)',
  buttonBackground: '#2563eb',
  buttonBackgroundDanger: '#c83535',
  buttonBackgroundDangerHover: '#de4747',
  buttonBackgroundHover: '#1d4ed8',
  buttonTextColor: '#f8fbff',
  connectedDotColor: '#22c55e',
  dangerBackground: 'rgba(200, 53, 53, 0.16)',
  errorBorderColor: '#a94444',
  errorColor: '#ff8d8d',
  focusRing: '0 0 0 3px rgba(59, 130, 246, 0.28)',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '15px',
  fontSizeXs: '11px',
  fontSizeSm: '12px',
  fontSizeMd: '14px',
  fontSizeLg: '16px',
  highlightedAreaBackground: '#0b1324',
  iconDangerColor: '#de4747',
  iconNeutralColor: '#8ea3ca',
  iconWarningColor: '#3b82f6',
  id: 'dark',
  identiconBackground: '#f2f6ff',
  inputBackground: '#0b1324',
  inputBorderColor: '#2b3e63',
  inputLabelFontSize: '10px',
  labelColor: '#9cb1d8',
  labelFontSize: '13px',
  labelLineHeight: '18px',
  lineHeight: '24px',
  lineHeightXs: '16px',
  lineHeightSm: '18px',
  lineHeightMd: '20px',
  lineHeightLg: '22px',
  parentLabelColor: '#5fb6a0',
  popupBackground: '#101a2f',
  primaryColor: '#3b82f6',
  readonlyInputBackground: '#101a2f',
  subTextColor: '#c5d4ee',
  successBackground: 'rgba(34, 197, 94, 0.14)',
  successBorderColor: '#2e7d6a',
  surfaceOverlay: 'rgba(15, 23, 42, 0.62)',
  textColor: '#f8fbff',
  textColorDanger: '#ff9a9a',
  warningBackground: 'rgba(59, 130, 246, 0.14)'
  ,
  zIndexBase: 1,
  zIndexHeader: 200,
  zIndexCardMenu: 4000,
  zIndexMenu: 5000,
  zIndexDropdown: 5100,
  zIndexModal: 6000,
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '24px'
};

export declare type Theme = typeof darkTheme;

const lightTheme: Theme = {
  ...darkTheme,
  addAccountImageBackground: '#fbfdff',
  backButtonBackground: '#f4f8ff',
  backButtonBackgroundHover: '#eaf1ff',
  backButtonTextColor: '#21314f',
  background: '#f4f8ff',
  bodyColor: '#f8fbff',
  boxBackground: '#ffffff',
  boxBorderColor: '#cddcf6',
  boxShadow: 'rgba(9, 24, 54, 0.14)',
  cardShadow: '0 6px 16px rgba(9, 24, 54, 0.14)',
  buttonBackgroundDanger: '#c83535',
  dangerBackground: 'rgba(200, 53, 53, 0.14)',
  errorBorderColor: '#c83535',
  errorColor: '#c83535',
  highlightedAreaBackground: '#f1f6ff',
  iconDangerColor: '#c83535',
  iconNeutralColor: '#5e7298',
  id: 'light',
  inputBackground: '#ffffff',
  inputBorderColor: '#c9d8f3',
  labelColor: '#4b5e82',
  parentLabelColor: '#2e7d6a',
  popupBackground: '#f7faff',
  readonlyInputBackground: '#f9fbff',
  subTextColor: '#324767',
  successBackground: 'rgba(46, 125, 106, 0.12)',
  successBorderColor: '#2e7d6a',
  surfaceOverlay: 'rgba(148, 163, 184, 0.26)',
  textColor: '#0f172a',
  textColorDanger: '#c83535',
  warningBackground: 'rgba(59, 130, 246, 0.12)'
};

export const themes = {
  dark: darkTheme,
  light: lightTheme
};

export declare type AvailableThemes = keyof typeof themes;

export function chooseTheme (): AvailableThemes {
  const preferredTheme = localStorage.getItem('theme');

  if (preferredTheme) {
    return preferredTheme === 'dark'
      ? 'dark'
      : 'light';
  }

  return 'light';
}
