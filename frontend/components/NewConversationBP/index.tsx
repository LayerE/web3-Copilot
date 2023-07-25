import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import assets from "@/public/assets";
import Row, { GridAutoWrap, ResponsiveRow } from "../common/Row";
import Image from "next/image";
import { ArrowRight, ChevronDown, Info, Terminal } from "react-feather";
import { useAppState } from "@/context/app.context";
import { PERSONA_TYPES, useChatStore } from "@/store";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Tippy from "@tippyjs/react";
import { useTour } from "@reactour/tour";
import { theme } from "@/theme";
import Header from "../Header";
import Button from "../common/Button";
import { DisabledLabel } from "../common/Label";

/*
EXAMPLE_PROMPT Types
 "stats" | "learn" | "mint" | "faucet" | "tokens"
*/
/*Personas Types
1. dev -> Advanced
2. new_dev -> Beginner
3. validator -> Degen
*/
const examplePromptsData = {
  dev: {
    prompts: [
      {
        txt: "Give me the code for a Soulbound ERC 721 contract",
        type: "learn",
      },
      {
        txt: "top tokens based on marketcap",
        type: "tokens",
      },
      {
        txt: "Mint me a ERC 1155 NFT",
        type: "mint",
      },
    ],
  },
  new_dev: {
    prompts: [
      {
        txt: "How do I get started with developing on web3?",
        type: "learn",
      },
      {
        txt: "What are the chains i should focus building on?",
        type: "learn",
      },
      {
        txt: "top NFT collections on Polygon",
        type: "stats",
      },
    ],
  },
  validator: {
    prompts: [
      {
        txt: "top collections based on volume ser?",
        type: "stats",
      },
      {
        txt: "what is the noise with zeroknowledge?",
        type: "learn",
      },
      {
        txt: "The art of being a Degen",
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
  const { currentSession, updateSessionType, credits, api_key, isLoggedIn } =
    useChatStore((state) => ({
      currentSession: state.currentSession,
      updateSessionType: state.updateSessionType,
      credits: state.credits,
      api_key: state.api_key,
      isLoggedIn: state.isLoggedIn,
    }));
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
        <ResponsiveRow
          style={{
            justifyContent: "center",
            gap: ".5rem",
          }}
        >
          <Image src={assets.logos.logo_layerE_circle} alt="" width={80} />
          <TitleWrapper>
            <AppTitle>
              <span>Web3 Copilot</span>
            </AppTitle>
            <DisabledLabel style={{ textAlign: "center" }}>
              Making Web3 conversational, accessible, and simple to use.
            </DisabledLabel>
          </TitleWrapper>
        </ResponsiveRow>
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
                <Button className="_prompt_btn">
                  {_prompt.type !== "learn" && (
                    <span
                      style={{ padding: "0 .25rem" }}
                    >{`/${_prompt.type}`}</span>
                  )}
                  <ArrowRight size={".8rem"} />
                </Button>
              </PromptCard>
            ))
          }
        </PromptExamples>{" "}
      </Column>
    </NewConversationBPWrapper>
  );
};

const TitleWrapper = styled(Column)`
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  align-items: center;
  `}
`;
const HeaderWrapper = styled(Row)`
  width: 100%;
  position: absolute;
  top: 0rem;
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
  text-align: center;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90.43deg,
    #fafbfc 19.92%,
    #9db6c9 43.48%,
    #ffffff 67.03%,
    #71828f 80.96%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  flex-grow: 1;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.bgCard};
  gap: 1rem;
  font-family: var(--ff-imp-reg);
  transition: 0.2s ease;
  position: relative;
  border: 1px solid ${({ theme }) => theme.stroke};
  height: 140px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bgBody};
    color: #fff;
  }
  ._prompt_btn {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    gap: 0.5rem;
    color: #fff;
    font-family: var(--ff-subtitle);
    min-width: 25px;
    min-height: 25px;
    overflow: hidden;
    padding: 0.15rem 0.35rem;
    border-radius: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height:120px;
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
