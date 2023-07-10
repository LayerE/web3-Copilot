import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { TEXT } from "@/theme/texts";
import assets from "@/public/assets";
import Row, { GridAutoWrap } from "../common/Row";
import Image from "next/image";
import { ArrowRight, ChevronDown, Info, Terminal } from "react-feather";
import { useAppState } from "@/context/app.context";
import { PERSONA_TYPES, useChatStore } from "@/store";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Tippy from "@tippyjs/react";
import { useTour } from "@reactour/tour";
import { theme } from "@/theme";
import ChatGPTLogo from "../BrandFooters/ChatGPTLogo";
import LayerELogo from "../BrandFooters/LayerELogo";
import Header from "../Header";
import { BrandLogo } from "../app/Header";

const examplePromptsData = {
  dev: {
    prompts: [
      {
        txt: "How do I start building on zkEVM?",
        type: "learn",
      },
      {
        txt: "Give me a smart contract code to deploy for a ERC 721",
        type: "learn",
      },
      {
        txt: "Guide to becoming a Polygon validator",
        type: "learn",
      },
    ],
  },
  new_dev: {
    prompts: [
      {
        txt: "How do I learn to develop on Polygon?",
        type: "learn",
      },
      {
        txt: "How do I begin my journey on Polygon?",
        type: "learn",
      },
      {
        txt: "What is Polygon ID? How is it useful?",
        type: "learn",
      },
    ],
  },
  validator: {
    prompts: [
      {
        txt: "Give me some details on Polygon Supernets",
        type: "learn",
      },
      {
        txt: "What's up with zkevm ser?",
        type: "learn",
      },
      {
        txt: "How do I go flexing my Polygon NFTs?",
        type: "learn",
      },
    ],
  },
};
const Personas = [
  {
    title: "Beginner",
    type: "new_dev",
    tooltip: "Start your Polygon Journey here",
    icon: assets.icons.icon_new_dev,
  },
  {
    title: "Advanced",
    type: "dev",
    tooltip: "Your expert developer assistant",
    icon: assets.icons.icon_dev,
  },
  {
    title: "Degen",
    tooltip: "A degen buddy to answer all your web3 doubts",
    type: "validator",
    icon: assets.icons.icon_validator,
  },
];
export const PolygonBetaLogo = () => (
  <AppTitle>
    <Image
      src={assets.logos.logo_polygon_circle}
      alt=""
      width={55}
      style={{ paddingRight: ".25rem" }}
    />
    <span style={{ fontFamily: "var(--ff-content)" }}>polygon</span>
    <span style={{ fontFamily: "var(--ff-light)" }}>Copilot</span>
  </AppTitle>
);
const NewConversationBP = () => {
  const { setExamplePrompt, open } = useAppState();
  const {
    currentSession,
    updateSessionType,
    credits,
    api_key,
    isLoggedIn,
    creditStatus,
  } = useChatStore();
  const [selectedPersona, setSelectedPerson] = useState("new_dev");
  const [showPersonasList, setShowPersonasList] = useState(false);
  const { setIsOpen } = useTour();
  const setPrompt = (prompt: string, cmd: string) => {
    if (credits > 0 || api_key?.length > 0) setExamplePrompt(prompt, cmd);
    else if (credits <= 0 && !isLoggedIn) {
      open("signUpModal");
    }
  };
  const node = useRef(null);
  useOnClickOutside(node, () => setShowPersonasList(false));
  useEffect(() => {
    if (currentSession()?.type) {
      setSelectedPerson(currentSession()?.type);
    }
  }, [currentSession()?.type]);
  return (
    <NewConversationBPWrapper>
      <Column
        style={{
          width: "100%",
          alignItems: "center",
          margin: "auto",
          gap: "clamp(1rem,3vw,2rem)",
          maxWidth: `${theme().ctrSizes.maxAppCtrWidth}`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Column
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <AppTitle>
              <span>Collectible Relationship Management</span>
            </AppTitle>
            <span>
              Your Web3 Assistant for all your Collectible Relationship
            </span>
          </Column>
        </div>
        <PersonasWrapper ref={node} className="tour_personas">
          {Personas?.map((persona, idx) => (
            <Tippy
              key={idx}
              content={persona.tooltip}
              placement={idx % 2 === 0 ? "bottom" : "top"}
            >
              <Persona
                gap={".35rem"}
                key={idx}
                id={persona?.title}
                onClick={() => {
                  updateSessionType(persona?.type as PERSONA_TYPES);
                  setSelectedPerson(persona?.type);
                }}
                isActive={selectedPersona === persona?.type ? true : false}
              >
                <Image src={persona.icon} alt="" width={18} />
                <p>{persona.title}</p>
              </Persona>
            </Tippy>
          ))}
        </PersonasWrapper>
        <PromptExamples minWidth={270} className="tour_prompting">
          {
            //@ts-ignore
            examplePromptsData[
              `${currentSession()?.type ?? "new_dev"}`
            ]?.prompts?.map((_prompt: any, key: any) => (
              <PromptCard
                key={key}
                id={_prompt.type + key}
                onClick={() => setPrompt(_prompt.txt, `/${_prompt.type}`)}
              >
                <p className="_prompt_description">{_prompt.txt}</p>
                <p className="_prompt_title">
                  {_prompt.type !== "learn" && `/${_prompt.type}`}
                  <ArrowRight size={".8rem"} />
                </p>
              </PromptCard>
            ))
          }
        </PromptExamples>{" "}
        {/* <Note>
          <p>
            Polygon Copilot leverages nascent AI technology that may provide
            inaccurate information.
            {<span className="_note_details"></span>}
          </p>
          <Tippy
            content="Please do not rely on information provided by Polygon Copilot
                  to make any financial, legal, or other decisions for which you
                  should seek independent professional advice from an individual
                  who is licensed and qualified in these areas."
            placement="top"
          >
            <p className="_more_info">
              <Info size={15} />
            </p>
          </Tippy>
        </Note> */}
        <FooterBrands>
          {/* <ChatGPTLogo />
          <LayerELogo /> */}
          <Header />
        </FooterBrands>
      </Column>
    </NewConversationBPWrapper>
  );
};

const FooterBrands = styled(Row)`
  width: 100%;
  padding: 0.5rem;
  position: absolute;
  top: 0rem;
  right: 0.5rem;
  gap: 0.5rem;
`;
const Note = styled.p`
  background: #212026;
  color: #f2f2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  width: fit-content;
  padding: 0.25rem 1rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0rem;
  left: 0;
  max-width: 90%;
  font-size: clamp(0.7rem, 1vw, 0.8rem);
  margin: 0 auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  ._note_details {
    display: none;
  }
  ._more_info {
    min-width: 15px;
    cursor: pointer;
    &:hover {
      color: #6eb2ff;
    }
  }
`;
const Persona = styled(Row)<{ isActive: boolean }>`
  cursor: pointer;
  width: fit-content;
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  border: ${(props) =>
    props?.isActive ? `1px solid ${props.theme.stroke}` : "none"};
  background: ${(props) =>
    props?.isActive ? " rgba(226, 225, 229, 0.25);" : ""};
  opacity: ${(props) => (props?.isActive ? "1" : "0.6")};

  &:hover {
    background: rgba(226, 225, 229, 0.25);
  }
`;
const PersonasWrapper = styled.div`
  display: flex;
  padding: 2px;
  border-radius: 2rem;
  overflow: hidden;
  background: #212026;
  border: 1px solid ${({ theme }) => theme.stroke};
`;

const PersonaBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 8px;
  display: flex;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
  width: 200px;
`;
const PromptExamples = styled(GridAutoWrap)`
  padding: 0.5rem;
  gap: 1rem;
`;
const AppTitle = styled.h2`
  font-family: var(--ff-light);
  gap: 0.25rem;
  font-size: clamp(1.75rem, 4vw, 3rem);
  color: #eee7f9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ._beta {
    position: absolute;
    top: -0.75rem;
    right: -1rem;
    font-size: clamp(0.5rem, 2vw, 0.7rem);
    font-family: var(--ff-light);
    border: 1px solid ${({ theme }) => theme.stroke};
    padding: 0.15rem 0.25rem;
    border-radius: 0.5rem;
    background: linear-gradient(180deg, #8a46ff 0%, #6e38cc 100%);
  }
`;
const PromptCard = styled(Column)`
  position: relative;
  padding: 1rem;
  height: 100%;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #1b181f 0%, #0e0c12 100%);
  gap: 1rem;
  color: #807f8b;
  font-family: var(--ff-imp-reg);
  transition: 0.2s ease;
  position: relative;
  border: 1px solid ${({ theme }) => theme.stroke};
  padding-bottom: 2.5rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bgBody};
    color: #fff;
  }
  ._prompt_title {
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    gap: 0.5rem;
    color: #fff;
    font-family: var(--ff-subtitle);
    width: fit-content;
    max-width: 100%;
    overflow: hidden;
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    background: #212026;
    box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    span {
      max-width: 85%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height:auto;
  font-size:.9rem;
  `}
`;
const NewConversationBPWrapper = styled(Column)`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 1rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

export default NewConversationBP;
