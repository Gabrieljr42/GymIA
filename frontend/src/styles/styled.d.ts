import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      primary: string;
      secondary: string;
      background: {
        primary: string;
        secondary: string;
        hover: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      error: string;
      success: string;
      warning: string;
    };
    font: {
      family: string;
      sizes: {
        small: string;
        medium: string;
        large: string;
      };
    };
    rounded: {
      small: string;
      medium: string;
      large: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
  }
} 