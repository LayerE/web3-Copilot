import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export async function filterSiteName(url: any) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\./;
  const match = regex.exec(url);
  return match ? match[1] : "";
}
export async function copyToClipboard(text: string, msg?: string) {
  if (navigator.clipboard) {
    toast.success(msg ?? "Text copied to clipboard");
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success(msg ?? "Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    document.body.removeChild(textArea);
  }
}
export function trimAddress(str: string) {
  if (str.length > 12) {
    return str.slice(0, 5) + "..." + str.slice(str.length - 4, str.length);
  }
  return str;
}

export function isMacintosh() {
  return window.navigator.platform.indexOf("Mac") > -1;
}

export function isWindows() {
  return window.navigator.platform.indexOf("Win") > -1;
}
export const checkForSlash = (input: string) => {
  let count = (input.match(/\//g) || []).length;
  return count;
};
export const checkForOneOrMoreTag = (input: string) => {
  let zkevm = input.includes("/learn");
  let mint = input.includes("/mint");
  let mintIDX = input.indexOf("/mint");
  let search = input.includes("/stats");

  return { zkevm: zkevm, mint: { mint, idx: mintIDX }, search: search };
};
export const truncatedAddress = (address: string) => {
  const truncated = `${address.substr(0, 6)}...${address.substr(-4)}`;

  return truncated;
};

function getOrCreateMeasureDom(id: string, init?: (dom: HTMLElement) => void) {
  let dom = document.getElementById(id);

  if (!dom) {
    dom = document.createElement("span");
    dom.style.position = "absolute";
    dom.style.wordBreak = "break-word";
    dom.style.fontSize = "14px";
    dom.style.transform = "translateY(-100vh)";
    dom.style.pointerEvents = "none";
    // dom.style.opacity = "0";
    dom.id = id;
    document.body.appendChild(dom);
    init?.(dom);
  }

  return dom!;
}
function getDomContentWidth(dom: HTMLElement) {
  const style = window.getComputedStyle(dom);
  const paddingWidth =
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const width = dom.clientWidth - paddingWidth;
  return width;
}
export function autoGrowTextArea(dom: HTMLTextAreaElement) {
  const measureDom = getOrCreateMeasureDom("__measure");
  const singleLineDom = getOrCreateMeasureDom("__single_measure", (dom) => {
    dom.innerText = "TEXT_FOR_MEASURE";
  });

  const width = getDomContentWidth(dom);
  measureDom.style.width = width + "px";
  measureDom.innerText = dom.value !== "" ? dom.value : "1";
  const endWithEmptyLine = dom.value.endsWith("\n");
  let height = parseFloat(window.getComputedStyle(measureDom).height);
  const singleLineHeight = parseFloat(
    window.getComputedStyle(singleLineDom).height
  );
  let rows = Math.round(height / singleLineHeight) + (endWithEmptyLine ? 1 : 0);

  // Limit the maximum number of rows to prevent overflowing after 1000px
  const maxHeight = 1000; // Set the maximum height in pixels
  const maxRows = Math.floor(maxHeight / singleLineHeight);
  rows = Math.min(rows, maxRows);

  return rows;
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: global?.window?.innerWidth,
    height: global?.window?.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: global?.window?.innerWidth,
        height: global?.window?.innerHeight,
      });
    };

    global?.window?.addEventListener("resize", onResize);

    return () => {
      global?.window?.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}
export const MOBILE_MAX_WIDTH = 600;
export const IPAD_MAX_WIDTH = 900;
export function useMobileScreen() {
  const { width } = useWindowSize();
  return width <= MOBILE_MAX_WIDTH;
}
export function useIPADScreen() {
  const { width } = useWindowSize();
  return width <= IPAD_MAX_WIDTH;
}

export const creditsCalc = (credits: number) => {
  let maxCredits = 40;
  let maxDailyCredits = 15;
  if (credits >= maxCredits) {
    return 0;
  } else if (credits + maxDailyCredits > maxCredits) {
    return maxCredits - credits;
  } else {
    const tokensToAdd = Math.min(maxDailyCredits, maxCredits - credits);
    return tokensToAdd;
  }
};
