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
import { useAppState } from "@/context/app.context";
import { useIPADScreen } from "@/utils/common";
import useIsMobView from "@/hooks/useIsMobView";
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

const AgentAISearchbar = ({
  ddDirection = "down",
}: {
  ddDirection: "up" | "down";
}) => {
  //STATES
  const router = useRouter();
  const {
    credits,
    api_key,
    addSessionGoal,
    jwt,
    isLoggedIn,
    hasSiteAccess,
    currentSession,
  } = useChatStore();
  const { address, isConnected } = useAccount();
  const { open: _open } = useAppState();
  const { open } = useWeb3Modal();
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const node = useRef<HTMLDivElement>(null);
  const { scrollRef, setAutoScroll } = useScrollToBottom();
  const [rows, setRows] = useState(1);
  const minRows = 1;
  const maxRows = 7;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (jwt && isLoggedIn && address) {
      formRef?.current?.reset();
      addSessionGoal(input, currentSession().id);
      setRows(1); //reset textarea row count
    } else if (!isLoggedIn && !isConnected && hasSiteAccess) {
      open();
    } else {
      _open("signUpModal");
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
    setInput(event.target.value);
  };

  useEffect(() => {
    if (router.query.input) {
      setInput(String(router?.query.input));
    }
    if (input.length === 1 && input === "/") {
      textareaRef.current!.value = "";
    }
  }, [input]);

  return (
    <AgentAISearchbarWrapper ref={node} style={{ overflow: "hidden" }}>
      <AgentAISearchbarCtr ref={scrollRef}>
        <InputWrapper ref={formRef} onSubmit={onSearch}>
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
            placeholder={"Enter your goal..."}
            required
            onKeyDown={handleTextAreaKeyDown}
            wrap="soft"
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
      </AgentAISearchbarCtr>
    </AgentAISearchbarWrapper>
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
const AgentAISearchbarCtr = styled.div`
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

const InputWrapper = styled.form`
  display: flex;
  width: 100%;
  gap: 0.5rem;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 1rem;
  position: relative;
`;

const AgentAISearchbarWrapper = styled.div`
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
export default AgentAISearchbar;
