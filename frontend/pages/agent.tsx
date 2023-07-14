import AgentAISearchbar from "@/components/AgentAISearchbar";
import RenderGoal from "@/components/RenderGoal";
import SearchBar from "@/components/SearchBar";
import Column from "@/components/common/Column";
import { HideMedium, ShowMedium } from "@/components/common/MdQryBlock";
import Row from "@/components/common/Row";
import { PageWrapper } from "@/components/common/Wrappers";
import assets from "@/public/assets";
import { useChatStore } from "@/store";
import { fadeInPage } from "@/utils/variants";
import Image from "next/image";
import React, { useEffect } from "react";
import styled from "styled-components";

const AgentAIPage = () => {
  const { currentSession, selectSession, sessions } = useChatStore();
  useEffect(() => {
    let lastIndex = sessions.findLastIndex(
      (session) => session.service === "agent_gpt"
    );
    const latestSession = sessions[lastIndex];
    selectSession(latestSession.id);
  }, []);

  return (
    <AgentAIPageWrapper
      variants={fadeInPage}
      initial="initial"
      animate="animate"
    >
      <ChatWindowWrapper>
        <ChatWindowInnerWrapper>
          <ChatWindow>
            {currentSession()?.goals?.length > 0 &&
              currentSession()?.goals.map((goal) => (
                <RenderGoal goal={goal} key={goal.title} />
              ))}
          </ChatWindow>
        </ChatWindowInnerWrapper>
        <HideMedium>
          <SearchbarWrapper className="tour_search">
            <AgentAISearchbar ddDirection="up" />{" "}
          </SearchbarWrapper>
        </HideMedium>
      </ChatWindowWrapper>
      <ShowMedium>
        <SearchbarWrapper className="tour_search_mob">
          <AgentAISearchbar ddDirection="up" />{" "}
        </SearchbarWrapper>
      </ShowMedium>
    </AgentAIPageWrapper>
  );
};

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
const AgentAIPageWrapper = styled(PageWrapper)`
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

export default AgentAIPage;
