import React, { memo, FC, useState} from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { Clipboard } from "react-feather";
import Row from "../common/Row";
import MarkdownContent from "../Markdown";
import { copyToClipboard } from "@/utils/common";

const ReadMore = ({ text }: { text: string }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <ReadmoreTxtWrapper>
      {isReadMore ? text.slice(0, 150) : text}
      {text.length > 150 && (
        <span onClick={toggleReadMore} className="_read-or-hide">
          {isReadMore ? "...read more" : " show less"}
        </span>
      )}
    </ReadmoreTxtWrapper>
  );
};
const ReadmoreTxtWrapper = styled.p`
  ._read-or-hide {
    font-size: 0.9rem;
    padding-left: 0.5rem;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Conversation: FC<{
  prompt: any;
}> = ({ prompt }) => {
  return (
    <ConversationWrapper>
      <PromptTitle>
        <ReadMore text={prompt.ques} />
        {!prompt?.streaming && (
          <span
            className="_copyPromptBtn"
            onClick={() => copyToClipboard(JSON.stringify(prompt?.content))}
          >
            Copy
            <Clipboard size={".9rem"} />
          </span>
        )}
      </PromptTitle>
      <PromptContentWrapper>
        <PromptContent>
          <MarkdownContent content={prompt?.ans} />
        </PromptContent>
      </PromptContentWrapper>
    </ConversationWrapper>
  );
};

const PromptTitle = styled(Row)`
  padding: 1rem 0.5rem;
  gap: 1rem;
  max-width: 800px;
  font-family: var(--ff-title);
  font-size: clamp(1rem, 2vw, 1.35rem);
  border-bottom: 1px solid ${(props) => props.theme.stroke};
  margin: 0 auto;
  align-items: flex-start;
  align-items: center;
  justify-content: space-between;

  ._copyPromptBtn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    min-width: 50px;
    color: #6e6e6e;
    font-size: 0.8rem;
    font-family: var(--ff-light);
    &:hover {
      color: #fff;
    }
  }
`;
const PromptContent = styled(Column)`
  width: 100%;
  max-width: 800px;
  padding-bottom: 0.5rem;
  gap: 1rem;
  overflow: hidden;
  overflow-x: auto;
  margin: 0 auto;

  &::-webkit-scrollbar {
    background-color: hsl(0, 0%, 29.01960784313726%);
    width: 8px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: hsl(0, 0%, 29.01960784313726%);
    border-radius: 0px;
    border: 1px solid #6f6f6f;
    border-top: 0px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #737373;
    border-radius: 0px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #9e77ed;
  }
`;
const PromptContentWrapper = styled(Column)`
  background: none;
  padding: 1rem 0;
  gap: 1rem;
  border-width: 1px solid ${({ theme }) => theme.stroke};
  position: relative;

  // scroll bar
  /* width */
  &::-webkit-scrollbar {
    background-color: hsl(0, 0%, 29.01960784313726%);
    width: 8px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: hsl(0, 0%, 29.01960784313726%);
    border-radius: 0px;
    border: 1px solid #6f6f6f;
    border-top: 0px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #737373;
    border-radius: 0px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #9e77ed;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:1rem 0.5rem;
   padding-bottom:3rem; //for feedback btn

  `}
`;
const ConversationWrapper = styled(Column)``;

export default memo(Conversation);
