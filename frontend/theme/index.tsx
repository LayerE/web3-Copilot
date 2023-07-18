import React, { useContext, useMemo } from "react";
import {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from "styled-components";

import { colors } from "./colors";
import assets from "@/public/assets";

export const MEDIA_WIDTHS = {
  upToExtraSmall: 600,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
  upToExtraLarge: 1600,
};
export const MIN_MEDIA_WIDTHS = {
  atleastExtraSmall: 600,
  atleastSmall: 720,
  atleastMedium: 960,
  atleastLarge: 1280,
  atleastExtraLarge: 1600,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const minMediaWidthTemplates: {
  [width in keyof typeof MIN_MEDIA_WIDTHS]: typeof css;
} = Object.keys(MIN_MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (min-width: ${(MIN_MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

export function theme(): DefaultTheme {
  return {
    ...colors(),
    borderRadius: {
      container: "8px",
      search: "8px",
      input: "8px",
      button: "8px",
      card: "8px",
    },

    // media queries
    mediaWidth: mediaWidthTemplates,
    minMediaWidth: minMediaWidthTemplates,

    //paddings
    paddings: {
      paddingSmall: ".5rem",
      padding: "1rem",
    },
    //ctr width
    ctrSizes: {
      maxAppCtrWidth: "1000px",
      maxThumbnailHeight: "200px",
    },
    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    gridCenter: css`
      display: grid;
      place-items: center;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
    customScrollBar: css`
      /* width */
      ::-webkit-scrollbar {
        width: 7px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
        height: 10px;
      }
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #505050;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 8px;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #dedede;
      }
    `,
    hideScrollBar: css`
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none;
      }
      /* Hide scrollbar for IE, Edge add Firefox */
      -ms-overflow-style: none;
      scrollbar-width: none; /* Firefox */
    `,
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeObject = theme();

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

export const ThemedGlobalStyle = createGlobalStyle`
 
/* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  /* Remove default margin */
  * {
    margin: 0;
    padding: 0;
  }
   @font-face {
    font-family: lightFont;
    font-weight: 400;
   src: url('./fonts/GeneralSans-Regular.otf');
  }
 @font-face {
    font-family: contentFont;
    font-weight: 500;
   src: url('./fonts/GeneralSans-Medium.otf');
  }
  @font-face {
    font-family: subtitleFont;
    font-weight: 500;
 src: url('./fonts/GeneralSans-Medium.otf');
  }
  @font-face {
    font-family: titleFont;
    font-weight: 600;
   src: url('./fonts/GeneralSans-Semibold.otf');
  }
    @font-face {
    font-family: impFont;
    font-weight: 600;
    src: url('./fonts/GeneralSans-Semibold.otf');
  }
   @font-face {
    font-family: impReg;
    font-weight: 400;
    src: url('./fonts/GeneralSans-Medium.otf');
  }
  :root {
    //fonts
    --ff-light:lightFont, sans-serif;
    --ff-content: contentFont, sans-serif;
    --ff-subtitle: subtitleFont, sans-serif;
    --ff-title: titleFont, sans-serif;
    --ff-imp:impFont, sans-serif;
    --ff-imp-reg:impReg, sans-serif;
    --fs-s: clamp(0.8rem, 1vw, 0.7rem);
    --fs-r: clamp(1rem, 2vw, 1.25rem);
    --fs-m: clamp(1.25rem, 2vw, 1.5rem);
    --fs-l: clamp(2rem, 3vw, 2.125rem);
    --fs-xl: clamp(2rem, 4vw, 3.375rem);
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul[role="list"],
  ol[role="list"] {
    list-style: none;
  }
  /* Set core root defaults */
  html:focus-within {
    scroll-behavior: smooth;
  }
    #__next{
    height: 100%;
    }
  html,
  body { 
    font-family: var(--ff-content);
    height: 100%;
 }
 
  /* Set core body defaults */
  body {
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    background: #0F0F0F;
    color:${({ theme }) => theme.primary}; 
    background-size:cover;  
  }


  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }
  /* Make images easier to work with */
  img,
  picture,
  svg {
    max-width: 100%;
    display: block;
  }
  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
    cursor: pointer;
  }
   /*hide choose file btn from input filed*/
  input[type="file"] {
    display: none;
  }
a{
  color:${({ theme }) => theme.primary};
}
  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
// scroll bar
  ${({ theme }) => theme.customScrollBar}
`;
