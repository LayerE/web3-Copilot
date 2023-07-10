import { useAppState } from "@/context/app.context";

import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
import styled from "styled-components";
import { useIPADScreen } from "./common";

export const disableBody = (target: any) => disableBodyScroll(target);
export const enableBody = (target: any) => enableBodyScroll(target);

export const useSteps = ({
  showSettingsTips,
}: {
  showSettingsTips?: boolean;
} = {}) => {
  const isIPADScreenOrLess = useIPADScreen();
  return isIPADScreenOrLess
    ? [
        {
          selector: ".tour_new_chat_mob",
          content: () => (
            <div>
              <TourBoxTitle>Creating a New Chat</TourBoxTitle>
              <TourBoxContent>
                Click the {'"'}New Chat{'"'} button to create a new chat.
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_personas",
          content: () => (
            <div>
              <TourBoxTitle>Personas</TourBoxTitle>
              <TourBoxContent>
                Select a persona {"("}beginner, advanced{")"} based on your
                needs.
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_prompting",
          content: () => (
            <div>
              <TourBoxTitle>Prompting</TourBoxTitle>
              <TourBoxContent>
                Click on a sample prompt or type your own and get started!
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_search_mob",
          content: () => (
            <div>
              <TourBoxTitle>Searchbar</TourBoxTitle>
              <TourBoxContent>
                Your prompt goes here. Use {"cmd + /"} for quick activation.
              </TourBoxContent>
            </div>
          ),
        },
      ]
    : [
        {
          selector: ".tour_personas",
          content: () => (
            <div>
              <TourBoxTitle>Personas</TourBoxTitle>
              <TourBoxContent>
                Select a persona {"("}beginner, advanced{")"} based on your
                needs.
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_prompting",
          content: () => (
            <div>
              <TourBoxTitle>Prompting</TourBoxTitle>
              <TourBoxContent>
                Click on a sample prompt or type your own and get started!
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_new_chat",
          content: () => (
            <div>
              <TourBoxTitle>Creating a New Chat</TourBoxTitle>
              <TourBoxContent>
                Click the {'"'}New Chat{'"'} button to create a new chat.
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_conversation_history",
          content: () => (
            <div>
              <TourBoxTitle>Conversation History</TourBoxTitle>
              <TourBoxContent>
                View your conversations and history here!
              </TourBoxContent>
            </div>
          ),
        },
        {
          selector: ".tour_search",
          content: () => (
            <div>
              <TourBoxTitle>Searchbar</TourBoxTitle>
              <TourBoxContent>
                Your prompt goes here. Use {"cmd + /"} for quick activation.
              </TourBoxContent>
            </div>
          ),
        },
      ];
};

const TourBoxTitle = styled.p`
  border: 1px solid;
  width: fit-content;
  background: radial-gradient(
      100% 100% at 50% 0%,
      rgba(22, 12, 39, 0) 0%,
      #3a2164 100%
    ),
    #160c27;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
`;
const TourBoxContent = styled.p`
  padding: 0.5rem;
`;
