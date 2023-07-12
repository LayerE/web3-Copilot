import {
  FlattenSimpleInterpolation,
  ThemedCssFunction,
} from "styled-components";

export type Color = string;
export interface Colors {
  // base
  primary: Color;
  secondary: Color;

  // backgrounds
  bgBody: Color;
  bgCard: Color;
  bgDropDown: Color;
  bgSidebar: Color;
  promptContentBG: Color;
  promptQuesBG: Color;
  bgModal: Color;
  bgTasks: Color;

  // Buttons
  btnPrimary: Color;
  btnActive: Color;

  // Gradients(-)
  primaryGradient: Color;
  textPrimaryGradient: Color;

  // different colors (-)
  blue: Color;
  blue100: Color;
  stroke: Color;
  imp: Color;
}

declare module "styled-components" {
  export interface DefaultTheme extends Colors {
    borderRadius: {
      container: string;
      card: string;
      search: string;
      input: string;
      button: string;
    };
    ctrSizes: {
      maxAppCtrWidth: string;
      maxThumbnailHeight: string;
    };

    //padding
    paddings: { padding: string; paddingSmall: string };

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>;
      upToSmall: ThemedCssFunction<DefaultTheme>;
      upToMedium: ThemedCssFunction<DefaultTheme>;
      upToLarge: ThemedCssFunction<DefaultTheme>;
      upToExtraLarge: ThemedCssFunction<DefaultTheme>;
    };
    minMediaWidth: {
      atleastExtraSmall: ThemedCssFunction<DefaultTheme>;
      atleastSmall: ThemedCssFunction<DefaultTheme>;
      atleastMedium: ThemedCssFunction<DefaultTheme>;
      atleastLarge: ThemedCssFunction<DefaultTheme>;
      atleastExtraLarge: ThemedCssFunction<DefaultTheme>;
    };

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation;
    flexRowNoWrap: FlattenSimpleInterpolation;
    gridCenter: FlattenSimpleInterpolation;
    customScrollBar: FlattenSimpleInterpolation;
    hideScrollBar: FlattenSimpleInterpolation;
  }
}
