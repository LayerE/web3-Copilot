import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Button, { GlowBtn } from "../common/Button";
import assets from "@/public/assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { useChatStore } from "@/store";
import Column from "../common/Column";
import { TEXT } from "@/theme/texts";
import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import { isMacintosh, useIPADScreen } from "@/utils/common";
import useIsMobView from "@/hooks/useIsMobView";
import { Terminal } from "react-feather";
import { silde } from "@/utils/variants";
import Row from "../common/Row";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { useWeb3Modal } from "@web3modal/react";

function useScrollToBottom() {
  // for auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    const dom = scrollRef.current;
    if (dom) {
      setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  };

  // auto scroll
  useLayoutEffect(() => {
    autoScroll && scrollToBottom();
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollToBottom,
  };
}

const Hint = ({
  type,
  description,
  setCMD,
  _key,
  isSelected,
  closeTagsList,
}: {
  type: string;
  description: string;
  _key: string;
  setCMD: () => void;
  closeTagsList: () => void;
  isSelected: boolean;
}) => {
  const isMobileView = useIsMobView();

  useEffect(() => {
    if (isSelected) {
      setCMD();
    }
  }, [isSelected]);
  return (
    <HintWrapper
      onClick={() => {
        setCMD();
        closeTagsList();
      }}
      style={
        isSelected
          ? {
              opacity: 1,
            }
          : { opacity: 0.5 }
      }
    >
      <Column width="fit-content">
        <TEXT.SmallHeader>{type}</TEXT.SmallHeader>
        <TEXT.Disabled size=".8rem">{description}</TEXT.Disabled>
      </Column>
      {!isMobileView ? (
        <span>
          {isMacintosh() ? "⌘" : "ctrl"} + {_key}
        </span>
      ) : (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".2rem",
            fontSize: ".9rem",
          }}
        >
          <Terminal size=".8rem" /> select
        </span>
      )}
    </HintWrapper>
  );
};
function keyCheck(event: any) {
  var KeyID = event.keyCode;

  switch (KeyID) {
    case 8:
    case 46:
      return true;
    default:
      return false;
  }
}
const HintWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  span {
    background: rgba(97, 97, 97, 0.3);
    padding: 0.15rem 0.5rem;
    border-radius: 0.25rem;
  }
  transition: 0.35s ease;
  &:hover {
    transform: scale(1.01);
  }
`;
const SearchBar = ({
  ddDirection = "down",
}: {
  ddDirection: "up" | "down";
}) => {
  //STATES
  const router = useRouter();
  const {
    onNewPrompt,
    credits,
    api_key,
    currentSession,
    selectSession,
    newSession,
    sessions,
    jwt,
    isLoggedIn,
    hasSiteAccess,
  } = useChatStore();
  const { address, isConnected } = useAccount();
  const { setCMD, currentCMD, examplePrompt, open: _open } = useAppState();
  const { open } = useWeb3Modal();
  const isMobileView = useIsMobView();
  const isIPADView = useIPADScreen();
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const node = useRef<HTMLDivElement>(null);
  const [tagClicked, setTagClicked] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { scrollRef, setAutoScroll } = useScrollToBottom();
  const [closeHints, setCloseHints] = useState(false);
  const [rows, setRows] = useState(1);
  const minRows = 1;
  const maxRows = 7;
  let placeholders = isIPADView
    ? ["Enter your question here...", "Press / to see all alpha"]
    : isMacintosh()
    ? [
        "Press ⌘ + /  to start searching",
        "Enter your question here...",
        "Press / for plugins",
      ]
    : [
        "Press ctrl + /  to start searching",
        "Enter your question here...",
        "Press / for plugins",
      ];

  const handleListKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement> | any
  ) => {
    if (event.key === "ArrowUp") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex === 0 ? SearchHints.length - 1 : prevIndex - 1
      );
    } else if (event.key === "ArrowDown") {
      setSelectedItemIndex((prevIndex) =>
        prevIndex === SearchHints.length - 1 ? 0 : prevIndex + 1
      );
    } else if (event.key === "Enter" && input.length === 1) {
      setTagClicked(false);
      textareaRef.current!.value = "";
      setInput("");
      setCMD(SearchHints[selectedItemIndex].type);
    }
  };
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (jwt && isLoggedIn && address) {
      if (
        currentSession().prompts[currentSession()?.prompts?.length - 1]
          ?.streaming
      ) {
        return;
      } else {
        if (input.startsWith("/")) {
          let search = input;
          switch (true) {
            case input.startsWith("/stats"): //@ts-ignore
              if (window?.gtag) {
                //@ts-ignore
                window?.gtag("event", "stats", {
                  event_category: "search",
                  event_label: "stats",
                });
              }
              search = search?.replace("/stats", "");
              search = search?.trim();
              onNewPrompt({ title: search, type: "stats" });
              break;
            case input.startsWith("/mint"): //@ts-ignore
              if (window?.gtag) {
                //@ts-ignore
                window?.gtag("event", "mint", {
                  event_category: "search",
                  event_label: "mint",
                });
              }
              search = search?.replace("/mint", "");
              search = search?.trim();
              onNewPrompt({ title: search, type: "mint" });
              break;
            case input.startsWith("/faucet"): //@ts-ignore
              if (window?.gtag) {
                //@ts-ignore
                window?.gtag("event", "faucet", {
                  event_category: "search",
                  event_label: "faucet",
                });
              }
              search = search?.replace("/faucet", "");
              search = search?.trim();
              onNewPrompt({ title: search, type: "faucet" });
            case input.startsWith("/tokens"): //@ts-ignore
              if (window?.gtag) {
                //@ts-ignore
                window?.gtag("event", "tokens", {
                  event_category: "search",
                  event_label: "tokens",
                });
              }
              search = search?.replace("/tokens", "");
              search = search?.trim();
              onNewPrompt({ title: search, type: "tokens" });
              break;
            default:
              //@ts-ignore
              if (window?.gtag) {
                //@ts-ignore
                window?.gtag("event", "search", {
                  event_category: "search",
                  event_label: "search",
                });
              }
              search = search?.replace("/learn", "");
              search = search?.trim();
              onNewPrompt({ title: search, type: "learn" });
              break;
          }
        } else {
          onNewPrompt({ title: input.replace("/learn", ""), type: "learn" });
          setCMD("/learn");
        }
        formRef?.current?.reset();
        setRows(1); //reset textarea row count
      }
    } else if (!isLoggedIn && !isConnected && hasSiteAccess) {
      open();
    } else {
      _open("signUpModal");
    }
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement> | any
  ) => {
    if (keyCheck(event) && textareaRef.current!.value?.length === 0) {
      setCMD("");
      setInput("");
      textareaRef.current!.value = "";
    } else if ((event.ctrlKey || event.metaKey) && event.key === "/") {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "/",
        });
      }
      // focus on the input field
      textareaRef.current!.value = "";
      textareaRef.current?.focus();
    } else if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "k",
        });
      }
      // new chat window
      if (sessions[0]?.prompts?.length > 0) {
        newSession();
      } else {
        selectSession(sessions[0].id);
      }
    } else if (event.key === "Escape") {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "Esc",
        });
      }
      textareaRef.current!.value = "";
      setInput("");
      setCMD("/learn");
      // focus on the input field
      textareaRef.current?.focus();
    } else if (event.key === "i" && (event.ctrlKey || event.metaKey)) {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "i",
        });
      }
      setCMD("/stats");
      // focus on the input field
      textareaRef.current?.focus();
    } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "z",
        });
      }
      setCMD("/learn");
      // focus on the input field
      textareaRef.current?.focus();
    } else if (event.key === "m" && (event.ctrlKey || event.metaKey)) {
      //@ts-ignore
      if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "key", {
          event_category: "key",
          event_label: "m",
        });
      }
      setCMD("/mint");
      // focus on the input field
      textareaRef.current?.focus();
    }
  };
  function handleTextAreaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement> | any
  ) {
    if (event.which === 13) {
      if (event.shiftKey && event.key === "Enter") {
        return;
      } else {
        if (typeof formRef?.current?.requestSubmit === "function") {
          formRef.current.requestSubmit();
        } else {
          formRef?.current?.dispatchEvent(
            new Event("submit", { cancelable: true })
          );
        }
      }

      event.preventDefault(); // Prevents the addition of a new line in the text field
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaLineHeight = 24;
    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows =
      Math.floor(event.target.scrollHeight / textareaLineHeight) - 1;

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }
    setRows(currentRows < maxRows ? currentRows : maxRows);
    if (event.target.value.length >= 1000) {
      toast.error("Prompt size not more than 1000 characters!");
    }
    setInput(
      currentCMD?.length > 1
        ? `${currentCMD} ${event.target.value}`
        : event.target.value
    );
  };

  const selectTag = () => {
    setTagClicked((prev) => !prev);
  };

  //USE-EFFECTS
  // useAutosizeTextArea(textareaRef.current, input);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sessions?.length]);
  useEffect(() => {
    if (examplePrompt.length > 0) {
      textareaRef.current!.value = examplePrompt;
      setInput(`${currentCMD} ${examplePrompt}`);
    }
  }, [examplePrompt]);
  useEffect(() => {
    if (router.query.input) {
      setInput(String(router?.query.input));
    }
    if (input.length === 1 && input === "/") {
      textareaRef.current!.value = "";
    }
  }, [input]);
  useEffect(() => {
    if (currentCMD && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentCMD, input?.length]);
  useEffect(() => {
    window.addEventListener("keydown", handleListKeyDown);
    return () => {
      window.removeEventListener("keydown", handleListKeyDown);
    };
  }, [handleListKeyDown]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [placeholders]);
  return (
    <SearchBarWrapper
      ref={node}
      style={
        tagClicked || (input.length === 1 && input === "/")
          ? { overflow: "initial" }
          : { overflow: "hidden" }
      }
    >
      <SearchBarCtr ref={scrollRef}>
        <InputWrapper ref={formRef} onSubmit={onSearch}>
          {currentCMD && currentCMD !== "/learn" ? (
            <CMD onClick={selectTag}>{currentCMD}</CMD>
          ) : null}
          <MultiLineInput
            id="search-input"
            ref={textareaRef}
            onChange={handleChange}
            onInput={handleChange}
            autoFocus={true}
            onFocus={() => setAutoScroll(true)}
            onBlur={() => setAutoScroll(false)}
            rows={rows}
            maxLength={1000}
            placeholder={
              (credits > 0 && currentSession()?.prompts?.length === 0) ||
              api_key.length > 0 ||
              !isLoggedIn ||
              !jwt
                ? placeholders[currentPlaceholderIndex]
                : credits > 0 && currentSession()?.prompts?.length > 0
                ? "Ask a follow up question..."
                : "You have no credits left!"
            }
            required
            onKeyDown={handleTextAreaKeyDown}
            wrap="soft"
            style={
              currentCMD && currentCMD !== "/learn"
                ? { paddingLeft: "5rem" }
                : {}
            }
            disabled={
              credits < 1 && api_key?.length === 0 && isLoggedIn && jwt
                ? true
                : false
            }
          />
          <SearchBtn
            disabled={
              credits === 0 && api_key?.length === 0 && isLoggedIn && jwt
                ? true
                : false
            }
          >
            <Image
              src={assets.icons.icon_send}
              alt=""
              width={25}
              style={{ minWidth: "1.5rem" }}
            />{" "}
          </SearchBtn>
        </InputWrapper>{" "}
        {(tagClicked || (input.length === 1 && input === "/")) &&
          !closeHints && (
            <HintsWrapper
              direction={ddDirection}
              variants={silde(ddDirection)}
              initial={"initial"}
              animate={"animate"}
            >
              <Hints>
                {SearchHints?.map((hint, index) => (
                  <Hint
                    key={index}
                    isSelected={selectedItemIndex === index ? true : false}
                    setCMD={() => {
                      setCMD(hint.type);
                      setSelectedItemIndex(index);
                    }}
                    closeTagsList={() => {
                      setTagClicked(false);
                    }}
                    type={hint.type}
                    description={hint.description}
                    _key={hint.key}
                  />
                ))}
                {!isMobileView ? (
                  <Row style={{ justifyContent: "flex-end" }}>
                    <TEXT.Disabled size=".8rem">
                      Press ESC to clear field.
                    </TEXT.Disabled>
                  </Row>
                ) : null}
              </Hints>
            </HintsWrapper>
          )}
      </SearchBarCtr>{" "}
    </SearchBarWrapper>
  );
};

const SearchBtn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #722424;
  flex-grow: 1;
  max-height: 55px;
  /* Shadow/xs */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
`;
const SearchBarCtr = styled.div`
  border-radius: 1rem;
  z-index: 10;
`;
const MultiLineInput = styled.textarea`
  border-radius: 19px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ theme }) => theme.bgBody};
  box-shadow: 0px 9px 8px 0px rgba(0, 0, 0, 0.25) inset;
  width: 100%;
  padding: 1rem;
  resize: none;
  outline: none;
  cursor: text;
  height: auto;
  overflow: hidden;
  overflow-y: auto;
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: ${({ theme }) => theme.primary};
`;
const CMD = styled.span`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  height: 35px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-family: var(--ff-subtitle);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  display: grid;
  font-size: 0.9rem;

  place-items: center;
  cursor: pointer;
  margin-top: auto;
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
`;
const Hints = styled(Column)`
  padding: 1rem;
  gap: 0.5rem;
  background: ${({ theme }) => theme.bgBody};
`;
const HintsWrapper = styled(motion.div)<{ direction: string }>`
  --radius: 1rem;
  padding: 1px;
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  padding: 1px;
  overflow: hidden;
  background: linear-gradient(
      0deg,
      rgba(97, 97, 97, 0.15),
      rgba(97, 97, 97, 0.15)
    ),
    radial-gradient(
      23.72% 23.72% at 76.77% 100%,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  z-index: 100;
  ${({ theme }) => theme.mediaWidth.upToMedium`
   margin:0 auto;
   `}
`;
const InputWrapper = styled.form`
  display: flex;
  width: 100%;
  gap: 0.5rem;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 1rem;
  position: relative;
`;

const SearchBarWrapper = styled.div`
  background: none;
  animation: animatedgradient 10s infinite linear;
  width: 100%;
  position: relative;
  padding: 1rem;
  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
   margin:0 auto;
   `}
`;
export default SearchBar;

//hints obj
const SearchHints = [
  // {
  //   id: 1,
  //   type: "/learn",
  //   description: "Learn about Polygon.",
  //   key: "z",
  // },
  {
    id: 1,
    type: "/stats",
    description: "Get NFT stats and analytics",
    key: "i",
  },
  {
    id: 2,
    type: "/mint",
    description: "Mint NFTs on Polygon and zkEVM",
    key: "m",
  },
  {
    id: 3,
    type: "/tokens",
    description: "Get Info about upcoming airdrops and token prices",
    key: "t",
  },
];
