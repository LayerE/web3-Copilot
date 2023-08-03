"use client";
import { useSteps } from "@/utils/onboard.config";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};
type modals = {
  signUpModal: boolean;
  referralModal: boolean;
  referralInfoModal: boolean;
  earnCreditsModal: boolean;
  apiModal: boolean;
  dislikePostModal: boolean;
  feedbackForms: boolean;
  siteAccessForm: boolean;
  earlyBirdForm: boolean;
  banner: boolean;
  shareSessionModal: boolean;
  showAppSettings: boolean;
  showSidebar: boolean;
  showTaskPannel: boolean;
  toolsModal: boolean;
};
export type modalPropChoices =
  | "signUpModal"
  | "referralModal"
  | "referralInfoModal"
  | "earnCreditsModal"
  | "dislikePostModal"
  | "apiModal"
  | "feedbackForms"
  | "siteAccessForm"
  | "earlyBirdForm"
  | "banner"
  | "shareSessionModal"
  | "showAppSettings"
  | "showSidebar"
  | "showTaskPannel"
  | "toolsModal";
interface ContextITFC {
  showModal: modals;
  currentCMD: string;
  examplePrompt: string;
  abortCurrentPrompt: boolean;
  showSplashScreen: boolean;
  tabID: number;
  onboardingSteps: any;
  _setOnboardingSteps: (steps: any) => void;
  setTabID: Dispatch<SetStateAction<any>>;
  abortPrompt: (abort: boolean) => void;
  setExamplePrompt: (prompt: string, cmd: string) => void;
  setCMD: (cmd: string) => void;
  close: (modalType: modalPropChoices) => void;
  open: (modalType: modalPropChoices) => void;
  link: string;
  setlink: (link: string) => void;
}
export const AppContext = createContext<ContextITFC>({
  showModal: {
    signUpModal: false,
    referralModal: false,
    referralInfoModal: false,
    earnCreditsModal: false,
    apiModal: false,
    dislikePostModal: false,
    feedbackForms: false,
    siteAccessForm: false,
    earlyBirdForm: false,
    banner: false,
    shareSessionModal: false,
    showAppSettings: false,
    showSidebar: false,
    showTaskPannel: false,
    toolsModal: false,
  },
  tabID: 1,
  setTabID: () => {},
  abortCurrentPrompt: false,
  currentCMD: "",
  examplePrompt: "",
  showSplashScreen: false,
  onboardingSteps: [],
  _setOnboardingSteps: () => {},
  close: () => {},
  open: () => {},
  setExamplePrompt: () => {},
  setCMD: () => {},
  abortPrompt: () => {},
  link: "",
  setlink: () => {},
});

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [tabID, setTabID] = useState(1);
  const [showModal, setShowModal] = useState<modals>({
    signUpModal: false,
    referralModal: false,
    referralInfoModal: false,
    earnCreditsModal: false,
    apiModal: false,
    dislikePostModal: false,
    feedbackForms: false,
    siteAccessForm: false,
    earlyBirdForm: false,
    banner: false,
    shareSessionModal: false,
    showAppSettings: false,
    showSidebar: false,
    showTaskPannel: false,
    toolsModal: false,
  });
  const [onboardingSteps, setOnboardingSteps] = useState([]);
  const [abortCurrentPrompt, setAbortCurrentPrompt] = useState(false);
  const [currentCMD, setCurrentCMD] = useState("");
  const [examplePrompt, setExpPrompt] = useState("");
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [link, setLink] = useState("");
  const _setOnboardingSteps = (steps: any) => {
    setOnboardingSteps(steps);
  };
  const close = (modalType: modalPropChoices) => {
    setShowModal((prev) => ({ ...prev, [modalType]: false }));
  };
  const open = (modalType: modalPropChoices) => {
    setShowModal((prev) => ({ ...prev, [modalType]: true }));
  };
  const abortPrompt = (abort: boolean) => {
    setAbortCurrentPrompt(abort);
  };
  const setExamplePrompt = (prompt: string, cmd: string) => {
    setExpPrompt(prompt);
    setCMD(cmd);
  };
  const setCMD = (cmd: string) => setCurrentCMD(cmd);
  const setlink = (link: string) => setLink(link);
  useEffect(() => {
    if (window?.localStorage?.getItem("banner_clicked")) {
      close("banner");
    } else {
      open("banner");
    }
  }, []);
  useEffect(() => {
    let stopSplash: any;
    if (!window.localStorage.getItem("testsplashShown")) {
      if (!window.localStorage.getItem("splashShown")) {
        window.localStorage.setItem("splashShown", "true");
        stopSplash = window.setTimeout(() => setShowSplashScreen(false), 3000);
      } else {
        stopSplash = window.setTimeout(() => setShowSplashScreen(false), 3000);
      }
    } else {
      setShowSplashScreen(false);
    }
    return () => {
      window.clearTimeout(stopSplash);
    };
  }, []);
  return (
    <AppContext.Provider
      value={{
        showModal,
        close,
        onboardingSteps,
        open,
        currentCMD,
        setCMD,
        setExamplePrompt,
        _setOnboardingSteps,
        examplePrompt,
        abortCurrentPrompt,
        abortPrompt,
        showSplashScreen,
        link,
        setlink,
        tabID,
        setTabID,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GloabalProvider");
  }
  return context;
}
