import AppSettings from "@/components/AppSettings";
import GoToBottomPageBtn from "@/components/GoToBottomPage/GoToBottomPageBtn";
import Loader from "@/components/Loader";
import EarlyBirdForm from "@/components/Modal/EarlyBirdForm";
import EarnCredits from "@/components/Modal/EarnCredits";
import FeedbackFormLinks from "@/components/Modal/FeedbackForms";
import Referral from "@/components/Modal/Referral";
import ShareSession from "@/components/Modal/ShareSession";
import Signup from "@/components/Modal/Signup";
import SiteAccessForm from "@/components/Modal/SiteAccessModal";
import ImagePreviewModal from "@/components/Modal/ImagePreviewModal";
import NewConversationBP from "@/components/NewConversationBP";
import Prompt from "@/components/Prompt";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import SkeletonLoader from "@/components/SkeletonLoader";
import Column from "@/components/common/Column";
import { HideMedium, ShowMedium } from "@/components/common/MdQryBlock";
import { PageWrapper } from "@/components/common/Wrappers";
import { useAppState } from "@/context/app.context";
import { BE_URL, useChatStore } from "@/store";
import { theme } from "@/theme";
import { copyToClipboard, useIPADScreen } from "@/utils/common";
import { fadeInPage } from "@/utils/variants";
import { useTour } from "@reactour/tour";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, RefreshCcw, XCircle } from "react-feather";
import styled from "styled-components";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
const Results = () => {
  const {
    currentSession,
    isLoggedIn,
    abortPrompt,
    api_key,
    sessions,
    onRegeneratePrompt,
    continueSession,
    jwt,
    selectSession,
    credits,
  } = useChatStore();
  const { showModal, open, setTabID } = useAppState();
  const session = currentSession(); //with smooth-scroll
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatWrapperRef = useRef<HTMLDivElement>(null);
  const resultPageRef = useRef<HTMLDivElement>(null);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const router = useRouter();
  const [chatWindowScrollHeight, setChatWindowScrollHeight] = useState(0);
  const [chatWindowHeight, setChatWindowHeight] = useState(0);

  const scrollToBottomWithSmoothScroll = (ref: any) => {
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
    // ref.current.scrollTop = ref?.current?.scrollHeight;
  };
  const handleTabChange = (ref: any) => {
    // Set the active tab and add a delay before scrolling to the bottom of the messages div
    window.setTimeout(() => {
      ref.current.scrollTop = ref?.current?.scrollHeight;
    }, 100);
  };
  const [continueSessionID, setContinueSessionID] = useState("");
  const { show_twitter_task, show_discord_task } = router.query;
  const { isConnected } = useAccount();
  const { setIsOpen } = useTour();
  const isMobView = useIPADScreen();
  const { query } = useRouter();
  useEffect(() => {
    if (query) {
      setContinueSessionID(query["chatID"] as string);
    }
  }, []);
  useEffect(() => {
    if (credits === 0 && isLoggedIn && jwt) {
      open("showAppSettings");
      setTabID(3);
    }
  }, [credits, isLoggedIn, jwt]);
  useEffect(() => {
    if (!localStorage.getItem("userOnboarded")) {
      localStorage.setItem("userOnboarded", "true");
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);
  useEffect(() => {
    if (currentSession()?.prompts?.length > 0 && currentSession()?.id) {
      setCurrentPrompt(
        currentSession()?.prompts[currentSession()?.prompts?.length - 1]
      );
    } else {
      setCurrentPrompt(null);
    }
  }, [currentSession()?.prompts?.length, currentSession()?.id]);
  useEffect(() => {
    if (
      sessions?.filter(
        (session) => session.conversation_id === continueSessionID
      ).length < 1 &&
      sessions?.filter(
        (session) => session.continuedSessionID === continueSessionID
      ).length < 1 &&
      isLoggedIn &&
      jwt &&
      continueSessionID.length > 0
    ) {
      //CREATE SESSION
      continueSession(continueSessionID);
    } else {
      //SESSION ALREADY EXISTS
      const _session = sessions?.filter(
        (session) => session.continuedSessionID === continueSessionID
      )[0];
      if (_session) selectSession(_session?.id);
    }
  }, [isLoggedIn, jwt, continueSessionID]);
  useEffect(() => {
    if (show_discord_task === "true" || show_twitter_task === "true") {
      open("showAppSettings");
    }
  }, [show_discord_task, show_twitter_task]);
  useEffect(() => {
    let timer1 = window.setTimeout(
      () =>
        router.push(`/`, undefined, {
          shallow: true,
        }),
      1000
    );
    return () => {
      window.clearTimeout(timer1);
    };
  }, []);
  useEffect(() => {
    if (chatWrapperRef.current) scrollToBottomWithSmoothScroll(chatWrapperRef);
    if (resultPageRef.current) scrollToBottomWithSmoothScroll(resultPageRef);
    if (chatWindowRef.current) scrollToBottomWithSmoothScroll(chatWindowRef);
  }, [
    session?.id,
    session?.prompts?.length,
    //@ts-ignore
    session?.prompts?.sources,
    chatWindowRef?.current?.scrollHeight,
    chatWrapperRef?.current?.scrollHeight,
    resultPageRef?.current?.scrollHeight,
  ]);
  //GET Chat window SCROLL_POSITION
  const handleScroll = (event: any) => {
    const scrollPosition = event.target.scrollTop;
    setChatWindowScrollHeight(scrollPosition);
  };
  //GET Chat window SCROLL_HEIGHT
  useEffect(() => {
    if (chatWindowRef.current)
      setChatWindowHeight(chatWindowRef.current.scrollHeight);
  }, [session.id]);

  return (
    <ResultsWrapper
      ref={resultPageRef}
      variants={fadeInPage}
      initial="initial"
      animate="animate"
    >
      <Sidebar onChangeTab={() => handleTabChange(chatWindowRef)} />
      <ChatWindowWrapper ref={chatWrapperRef}>
        <Header />
        {session?.prompts?.length === 0 ? (
          <NewConversationBP />
        ) : (
          <ChatWindowInnerWrapper>
            <ChatWindow
              ref={chatWindowRef}
              style={{ position: "relative" }}
              onScroll={handleScroll}
            >
              {" "}
              {session?.prompts?.map((prompt, idx) => (
                <Prompt
                  prompt={prompt}
                  key={prompt?.id + prompt?.title}
                  prompt_idx={idx}
                />
              ))}
              {chatWindowHeight > 1000 && (
                <GoToBottomPageBtn
                  scrollToBottom={() =>
                    scrollToBottomWithSmoothScroll(chatWindowRef)
                  }
                  scrollHeight={chatWindowScrollHeight}
                />
              )}
              {currentPrompt && (
                <AbortBtns key={currentSession()?.id}>
                  {!currentPrompt?.abortPrompt &&
                    currentPrompt?.streaming &&
                    currentPrompt?.content && (
                      <AbortBtn
                        style={{ width: "fit-content" }}
                        onClick={() => {
                          abortPrompt(currentPrompt);
                        }}
                      >
                        <XCircle size={"1.15rem"} className="_icon" />
                        <span>Stop Generating Response</span>
                      </AbortBtn>
                    )}
                  {((currentPrompt?.abortPrompt &&
                    !currentPrompt?.streaming &&
                    currentSession()?.prompts?.length > 0) ||
                    (!currentPrompt?.streaming && currentPrompt?.content)) && (
                    <AbortBtn
                      style={{ width: "fit-content" }}
                      onClick={() => {
                        onRegeneratePrompt(currentPrompt?.id);
                      }}
                    >
                      <RefreshCcw size={"1rem"} className="_icon" />
                      <span>Regenerate Response</span>
                    </AbortBtn>
                  )}{" "}
                  {currentSession().conversation_id && (
                    <AbortBtn
                      onClick={() => {
                        copyToClipboard(
                          encodeURI(
                            `${window.location.origin}/chats?chat_id=${
                              currentSession()?.conversation_id
                            }&title=${currentSession()?.topic}`
                          ),
                          "Session link copied!"
                        );
                      }}
                    >
                      <ExternalLink
                        style={{ cursor: "pointer" }}
                        size="1rem"
                        className="_icon"
                      />
                      <span>Share Conversation</span>
                    </AbortBtn>
                  )}
                </AbortBtns>
              )}{" "}
            </ChatWindow>
            {/* {currentPrompt?.streaming && !currentPrompt?.content && <Loader />} */}
          </ChatWindowInnerWrapper>
        )}{" "}
        <HideMedium>
          <SearchbarWrapper className="tour_search">
            <SearchBar ddDirection="up" />{" "}
          </SearchbarWrapper>
        </HideMedium>
      </ChatWindowWrapper>
      <ShowMedium>
        <SearchbarWrapper className="tour_search_mob">
          <SearchBar ddDirection="up" />{" "}
        </SearchbarWrapper>
      </ShowMedium>
      {showModal.signUpModal && !isConnected ? <Signup /> : null}
      {showModal.earnCreditsModal && isLoggedIn && api_key.length === 0 ? (
        <EarnCredits />
      ) : null}{" "}
      {showModal.referralModal && isLoggedIn ? <Referral /> : null}
      {showModal.feedbackForms ? <FeedbackFormLinks /> : null}
      {showModal.siteAccessForm ? <SiteAccessForm /> : null}
      {showModal.earlyBirdForm ? <EarlyBirdForm /> : null}
      {showModal.shareSessionModal ? <ShareSession /> : null}{" "}
      {showModal.showAppSettings ? <AppSettings /> : null}
      {showModal.imagePreviewModal ? <ImagePreviewModal /> : null}
    </ResultsWrapper>
  );
};
const AbortBtns = styled.div`
  position: sticky;
  height: 50px;
  bottom: -100px;
  right: 0;
  left: 0;
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;
const AbortBtn = styled.div`
  padding: 0.5rem 0.75rem;
  background: linear-gradient(0deg, #121212, #121212), #160c27;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 24px rgba(255, 78, 78, 0.3), 0px 3px 0px #000000;
  font-size: 0.8rem;
  gap: 0.5rem;
  border-radius: 2rem;
  transition: 0.5s ease;
  text-align: center;
  cursor: pointer;
  /* padding-left: 1.55rem; */
  text-align: center;
  ._icon {
    display: inline-block;
    transform: translateY(10%);
  }
  span {
    position: relative;
    display: inline-block;
    vertical-align: top;
    max-width: 0;
    white-space: nowrap;
    opacity: 0;
    overflow: hidden;
    z-index: 1;
    font-weight: normal;
    transition: 0.5s ease;
    pointer-events: none;
  }
  &:hover {
    opacity: 1;
    transform: scale(0.98);
    span {
      max-width: 300px;
      margin-left: 0.25rem;
      opacity: 1;
    }
  }
`;
const SearchbarWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 0;
  background: #0e0f11;

  ${({ theme }) => theme.mediaWidth.upToMedium`

    position:absolute;  border-top: 1px solid rgba(255, 255, 255, 0.1);
    bottom:0;
    left:0;
  `}
`;
const ChatWindow = styled(Column)`
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
  flex-grow: 1;
  padding-bottom: 3rem; // for abort btns
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge add Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius:0;
    border:0;
  `}
`;
const ChatWindowInnerWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 3rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius:0;
    border:0;  
  `}
`;
const ShareBtn = styled.div`
  background: #000;
  height: fit-content;
  border: 1.5px solid #a68bd4;
  margin-top: auto;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: grid;
  place-items: center;
  cursor: pointer;
`;
const ChatWindowWrapper = styled(Column)`
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge add Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-grow:1;
    padding:0;
    border-radius:0;
    gap: 0.5rem;
    margin-top:3.5rem;
    margin-bottom:3.5rem;
  `}
`;
const ResultsWrapper = styled(PageWrapper)`
  position: relative;
  justify-content: initial;
  align-items: initial;
  flex-direction: row;
  margin: auto;

  height: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction:column;
    padding:.5rem;
    border:0;   
  `}
`;

export default Results;
