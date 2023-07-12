import { Colors } from "./styled";

export function colors(): Colors {
  return {
    // base
    primary: "#fff",
    secondary: "#807F8B",
    bgBody: "#050505",
    bgCard: "rgba(255, 255, 255, 0.03)",
    bgDropDown: "#292929",
    bgSidebar: "rgba(12, 14, 19, 0.40)",
    promptContentBG: "#1E1E1E",
    promptQuesBG: "rgba(24, 25, 28, 0);",
    bgModal: "rgba(33, 33, 33, 1)",
    bgTasks:"rgba(255, 255, 255, 0.07)",
    // Buttons
    btnPrimary: "#722424",
    btnActive:
      "radial-gradient(100% 100% at 50% 0%, rgba(22, 12, 39, 0) 0%, #3A2164 100%), #160C27;",

    // Gradients(-)
    primaryGradient: "#050505",
    textPrimaryGradient: "linear-gradient(90deg, #ACACAC 0%, #414141 100%)",
    //other colors
    blue: "#2C2042",
    blue100: "#3e2d5b",
    stroke: "rgba(255, 255, 255,0.1)",
    imp: "rgba(255, 78, 78, 1)",
  };
}
