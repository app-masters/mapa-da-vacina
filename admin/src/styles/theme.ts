export const breakpoints = {
  mobile: 480,
  tablet: 576,
  medium: 768,
  laptop: 992,
  desktop: 1280,
  wide: 1440
};

export type BreakpointsList = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
};

export const styleBreakpoints: BreakpointsList = {
  xs: `${breakpoints.mobile}px`,
  sm: `${breakpoints.tablet}px`,
  md: `${breakpoints.medium}px`,
  lg: `${breakpoints.laptop}px`,
  xl: `${breakpoints.desktop}px`,
  xxl: `${breakpoints.wide}px`
};

export type ColorsList = {
  primary: string;
  background: string;
  white: string;
  gray: string;
  disabled: string;
  darkGray: string;
  alertColor: string;
};

export const colors: ColorsList = {
  primary: '#1890ff',
  background: '#f0f2f5',
  white: '#FFFFFF',
  gray: '#333333',
  disabled: '#00000010',
  darkGray: '#747474',
  alertColor: '#ff767510'
};

export type SpacingList = {
  /**
   * 0px
   */
  none: string;
  /**
   * 2px
   */
  xxs: string;
  /**
   * 4px
   */
  xs: string;
  /**
   * 8px
   */
  sm: string;
  /**
   * 16px
   */
  default: string;
  /**
   * 18px
   */
  base: string;
  /**
   * 32px
   */
  md: string;
  /**
   * 48px
   */
  lg: string;
  /**
   * 60px
   */
  xl: string;
  /**
   * 72px
   */
  xxl: string;
};

export const spacing: SpacingList = {
  none: '0px',
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  default: '16px',
  base: '18px',
  md: '32px',
  lg: '48px',
  xl: '60px',
  xxl: '72px'
};

export type SpacingName = keyof SpacingList;

export const theme = {
  name: 'Default',
  colors,
  breakpoints: styleBreakpoints,
  spacing
};

export type AppTheme = typeof theme;
