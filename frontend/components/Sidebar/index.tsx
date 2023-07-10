import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import {
  AlertTriangle,
  Edit,
  Menu,
  MessageCircle,
  MessageSquare,
  Plus,
  PlusCircle,
  Star,
  Zap,
  X,
} from "react-feather";
import Column from "../common/Column";
import { useChatStore } from "@/store/app";
import Session from "../Session";
import { BrandLogo } from "../app/Header";
import { TEXT } from "@/theme/texts";
import Row from "../common/Row";
import { HideMedium, ShowMedium } from "../common/MdQryBlock";
import { useAppState } from "@/context/app.context";
import { ConnectWalletButton } from "../ConnectWalletBtn";
import assets from "@/public/assets";
import Image from "next/image";
import { isMacintosh } from "@/utils/common";
import Tippy from "@tippyjs/react";
import { useTour } from "@reactour/tour";

const Sidebar = ({ onChangeTab }: { onChangeTab: () => void }) => {
  const {
    sessions,
    newSession,
    removeSession,
    selectSession,
    currentSession,
    isLoggedIn,
    credits,
    jwt,
    api_key,
  } = useChatStore();
  const { setIsOpen } = useTour();
  const [historyNav, setHistoryNav] = useState({ recent: true, fvrts: false });
  const [showMenu, setShowMenu] = useState(false);
  const { open, setTabID } = useAppState();
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setHeight] = useState(224);
  const [sessionAndFvrtCount, setSessionAndFvrtCount] = useState({
    sessionCount: 0,
    fvrtsCount: 0,
  });

  // const showSettingModalTour = () => {
  //   setIsOpen(true);
  // };
  const creatNewSession = () => {
    if (sessions[0]?.prompts?.length > 0) {
      newSession();
    } else {
      selectSession(0);
    }
  };
  const _sessions = useMemo(() => {
    return sessions;
  }, [historyNav?.fvrts, historyNav?.recent, sessions]);

  useEffect(() => {
    if (footerRef?.current) {
      setHeight(footerRef?.current?.scrollHeight);
    }
  }, [footerRef?.current, footerHeight, isLoggedIn]);

  useEffect(() => {
    if (sessions) {
      const sessionCount = sessions.length;
      const fvrtsCount = sessions.filter((session) => session?.isFvrt).length;
      setSessionAndFvrtCount({ sessionCount, fvrtsCount });
    }
  }, [sessions]);
  return (
    <SidebarWrapper navheight={showMenu ? "100%" : "3.5rem"}>
      <ShowMedium>
        <MobileNav>
          {showMenu ? (
            <X onClick={() => setShowMenu(false)} />
          ) : (
            <Menu onClick={() => setShowMenu(true)} />
          )}
          <SessionTitle>{currentSession().topic}</SessionTitle>
          <Button
            style={{
              width: "fit-content",
              padding: 0,
              border: `none`,
            }}
            onClick={creatNewSession}
            className="tour_new_chat_mob"
          >
            <Plus size="1.25rem" />
          </Button>
        </MobileNav>
      </ShowMedium>

      <SidebarDesktop hidebar={showMenu ? "true" : "false"}>
        <SidebarCotent
          style={{
            height: `calc(100% - ${footerHeight}px)`,
          }}
        >
          <Column
            style={{
              padding: "1rem",
              gap: "2rem",
              paddingBottom: 0,
              alignItems: "center",
            }}
          >
            <BrandLogo hideBetaLogo={true} />
            <HideMedium style={{ width: "100%" }}>
              {/* <Tippy
                content={
                  sessions[0]?.prompts?.length > 0
                    ? "Start a new chat with Copilot"
                    : "Hey, you’re already in a new chat"
                }
                placement="right"
              > */}
              <NewChatButton
                id="new-chat"
                onClick={creatNewSession}
                className="tour_new_chat"
              >
                <Zap size="1.25rem" />
                <span>Switch to AI Agent</span>
                <span
                  style={{
                    fontSize: ".8rem",
                  }}
                >
                  {/* {isMacintosh() ? "⌘ + k" : "ctrl + k"} */}
                </span>
              </NewChatButton>
              {/* </Tippy> */}
            </HideMedium>
          </Column>

          <ChatHistory
            className="tour_conversation_history"
            style={
              jwt && isLoggedIn ? {} : { flex: 1, justifyContent: "center" }
            }
          >
            {jwt && isLoggedIn ? (
              <>
                <span
                  style={{
                    display: "flex",

                    flexDirection: "column",
                    gap: ".5rem",
                    padding: "0.5rem 1.2rem",
                  }}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      background: "transparent",
                    }}
                    onClick={creatNewSession}
                  >
                    <Plus size="1rem" />
                    <span>New Chat</span>
                  </Button>
                </span>
                {_sessions?.length >= 1 &&
                  _sessions?.slice(0, 1).map((session, idx) => (
                    <Session
                      key={idx}
                      title={session.topic}
                      id={session.id! as number}
                      persona={session?.type}
                      isActive={session?.id === currentSession()?.id}
                      closeMenu={() => setShowMenu(false)}
                      convoID={session.conversation_id as string}
                      deleteSession={() => removeSession(idx)}
                      session={session}
                      selectSession={() => {
                        selectSession(idx);
                        if (currentSession().prompts.length > 0) onChangeTab();
                      }}
                    />
                  ))}

                <Tab isActive={historyNav?.fvrts}>
                  <span>Favourites ({sessionAndFvrtCount?.fvrtsCount})</span>
                </Tab>
              </>
            ) : null}
            {jwt && isLoggedIn && sessionAndFvrtCount?.sessionCount > 0 ? (
              <>
                {_sessions?.length >= 1 &&
                  _sessions
                    ?.filter((id) => id.isFvrt)
                    ?.map((session, idx) => (
                      <Session
                        key={idx}
                        title={session.topic}
                        id={session.id! as number}
                        persona={session?.type}
                        isActive={session?.id === currentSession()?.id}
                        closeMenu={() => setShowMenu(false)}
                        convoID={session.conversation_id as string}
                        deleteSession={() => removeSession(idx)}
                        session={session}
                        selectSession={() => {
                          selectSession(idx);
                          if (currentSession().prompts.length > 0)
                            onChangeTab();
                        }}
                      />
                    ))}
              </>
            ) : _sessions?.length < 1 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  color: "#807F8B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".5rem",
                  fontSize: ".9rem",
                }}
              >
                <AlertTriangle color="#807F8B" size={20} />
                <span>
                  Looks like you don{"'"}t <br /> have a favourite session.
                </span>
              </p>
            ) : null}
            <Tab>
              <span>Recents</span>
            </Tab>
            {jwt && isLoggedIn && sessionAndFvrtCount?.sessionCount > 0 ? (
              <>
                {_sessions?.length >= 1 &&
                  _sessions?.slice(1, _sessions.length).map((session, idx) => (
                    <Session
                      key={idx}
                      title={session.topic}
                      id={session.id! as number}
                      persona={session?.type}
                      isActive={session?.id === currentSession()?.id}
                      closeMenu={() => setShowMenu(false)}
                      convoID={session.conversation_id as string}
                      deleteSession={() => removeSession(idx)}
                      session={session}
                      selectSession={() => {
                        selectSession(idx);
                        if (currentSession().prompts.length > 0) onChangeTab();
                      }}
                    />
                  ))}
              </>
            ) : null}

            {!jwt && !isLoggedIn && (
              <p
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  color: "#807F8B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".5rem",
                }}
              >
                <span>
                  Connect Wallet to <br />
                  access History
                </span>
              </p>
            )}
          </ChatHistory>
        </SidebarCotent>
        <SidebarFooter ref={footerRef}>
          <Column
            style={{
              padding: "1rem",
              gap: "2rem",
              paddingBottom: 0,
              alignItems: "center",
            }}
          >
            {(jwt && isLoggedIn) || credits > 0 ? (
              <Tippy content="Total credit balance" placement="right">
                <CreditsBtn
                  onClick={() => {
                    open("showAppSettings");
                    setTabID(3);
                  }}
                >
                  <span>
                    Your Credits :{" "}
                    {api_key ? <span>N{"/"}A</span> : <span>{credits}</span>}{" "}
                  </span>

                  <Image src={assets.icons.icon_credits} alt="" width={20} />
                </CreditsBtn>
              </Tippy>
            ) : null}
          </Column>
          <Column
            style={{
              padding: "1rem",
              paddingBottom: 0,
              width: "100%",
            }}
          >
            {jwt && isLoggedIn ? (
              <Tippy content="Check app settings" placement="right">
                <SidebarBtn
                  onClick={
                    jwt && isLoggedIn
                      ? () => {
                          open("showAppSettings");
                          setTabID(1);
                        }
                      : () => {}
                  }
                >
                  <Image src={assets.icons.icon_settings} alt="" width={15} />
                  <span>Settings</span>
                </SidebarBtn>
              </Tippy>
            ) : null}

            <SidebarBtn
              id="how-to-use"
              onClick={() =>
                window.open(
                  "https://layer-e.gitbook.io/polygon-copilot-docs/",
                  "_blank"
                )
              }
            >
              <Image src={assets.logos.logo_layerE_circle} alt="" width={15} />{" "}
              User Guide
            </SidebarBtn>
          </Column>
        </SidebarFooter>
      </SidebarDesktop>
    </SidebarWrapper>
  );
};

export const BtnImgWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;

  border: 0.5px solid white;
  border-radius: 8px;
`;

const SessionTitle = styled.p`
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const MobileNav = styled(Row)`
  padding: 1rem;
  background: ${({ theme }) => theme.bgSidebar};
  justify-content: space-between;
`;
const SidebarDesktop = styled(Column)<{ hidebar: string }>`
  height: 100%;
  background: ${({ theme }) => theme.bgSidebar};
  overflow: hidden;
  ${(props) => props.theme.mediaWidth.upToMedium`   
    transition: all .4s ease;
     opacity:${props?.hidebar === "true" ? 1 : 0};
  height:${props?.hidebar === "true" ? "100%" : "0px"};
  `}
  position: relative;
  z-index: 999;
`;
const SidebarBtn = styled(Button)`
  display: flex;

  height: 40px;
  padding: 0px 10px;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: none;
`;
const HistoryNav = styled(Row)`
  --disabled-color: #807f8b;
  --active-color: #ebebeb;
  padding-bottom: 0.5rem;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
`;
const Tab = styled.button<{ isActive?: boolean }>`
  background: none;
  outline: none;
  border: none;
  flex: 1;
  font-size: 0.9rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 1rem;
  gap: 0.25rem;
  transition: all 0.5s;
  border-bottom: 1px solid #2d2d2d;
  background: ${({ theme }) => theme.bgSidebar};
  position: relative;
  color: ${(props) =>
    props?.isActive ? "var(--active-color)" : "var(--disabled-color)"};
  &:after {
    content: "";
    transition: all 0.25s;
    position: absolute;
    bottom: 0;
    width: ${(props) => (props?.isActive ? "80px" : "0px")};
    padding: 1.5px;
    border-radius: 1rem;
    background: ${(props) =>
      props?.isActive ? "rgba(255, 255, 255, 0.5)" : "none"};
  }
`;
const SidebarWrapper = styled(Column)<{ navheight: string }>`
  --footer-height: 224px;
  max-width: 280px;
  border-radius: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  background: #0f0f0f;
  z-index: 10;
  overflow-y: auto;
  position: relative;
  ${(props) => props.theme.mediaWidth.upToMedium` 
   position:fixed;
   top:0;
   left:0;
   border-radius:0;
   max-width:initial;
   height:${props.navheight ?? "initial"};
   z-index:999;    
   border:0;
  `};
`;
const SidebarFooter = styled.div`
  gap: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  background: #0a090d;
  padding: 0.5rem 0;
`;
const SidebarCotent = styled(Column)`
  gap: 1rem;
  align-items: center;
  /* height: calc(100% - var(--footer-height)); */
  /* ${(props) => props.theme.mediaWidth.upToMedium` max-height: 70%;`} */
`;

const CreditsBtn = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 0px 10px;
  gap: 10px;
  border-radius: 12px;
  background: rgba(66, 66, 66, 0.3);
  gap: 1rem;
  font-size: 0.85rem;
`;

const NewChatButton = styled(Button)`
  width: 100%;
  transition: 0.5s ease;
  border-radius: 12px;
  background: #722424;
  display: flex;

  height: 60px;

  justify-content: center;
  align-items: center;
`;
const ChatHistory = styled(Column)`
  gap: 0.75rem;
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  padding-bottom: 1rem;
  /* Hide scrollbar for Chrome, Safari and Opera */
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge add Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
`;
export default Sidebar;
