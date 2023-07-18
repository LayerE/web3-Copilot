import React, { memo, FC, useEffect, useState, ReactNode } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { Goal, useChatStore } from "@/store";
import Row from "../common/Row";
import MarkdownContent from "../Markdown";
import Image from "next/image";
import assets from "@/public/assets";
import { TEXT } from "@/theme/texts";
import { goals } from "../NewAgentConversationBP";
import Button from "../common/Button";

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

const GoalPage: FC<{
  goal: Goal;
}> = ({ goal }) => {
  const { generateGoalSummary, currentSession } = useChatStore();
  const summarizeTask = () => {
    const allTaskContent = goal.tasks.map((task) => task.content);
    generateGoalSummary(goal, allTaskContent, currentSession().id);
  };
  return (
    <GoalWrapper>
      <GoalTitle>
        <div className="_titleContent">
          <ReadMore text={goal?.title} />
        </div>
      </GoalTitle>
      <GoalContentWrapper>
        {goal.streamingGoal ? (
          <Row
            style={{
              gap: ".5rem",
              color: "rgba(255, 255, 255, 0.50)",
              borderRadius: " .5rem",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: ".5rem 1rem",
            }}
          >
            <Image src={assets.icons.icon_brain} width={15} alt="" />
            <span>Copilot is understanding your question . . .</span>
          </Row>
        ) : (
          <GoalTasks>
            <TEXT.SmallHeader>New tasks created:</TEXT.SmallHeader>
            {goal.tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </GoalTasks>
        )}

        <GoalContent>
          {goal.tasks.map((task) => (
            <TaskWrapper key={task?.id}>
              <GoalTitle>
                <ReadMore text={task?.title} />
              </GoalTitle>
              <div style={{ padding: "1rem" }}>
                {!task?.content ? (
                  <Row style={{ gap: ".5rem", color: "#494949" }}>
                    <Image src={assets.icons.icon_brain} width={15} alt="" />
                    <span>Task in queue...</span>
                  </Row>
                ) : (
                  <MarkdownContent
                    content={task.content}
                    isDone={task.streamingTask && task.content ? true : false}
                  />
                )}
                {task?.taskFullyLoaded &&
                  task?.id === goal.tasks[goal.tasks.length - 1]?.id &&
                  !goal?.summary && (
                    <Button
                      style={{
                        width: "100%",
                        gap: ".5rem",
                        padding: ".5rem",
                        marginTop: "1rem",
                      }}
                      onClick={summarizeTask}
                    >
                      <span>Summarize All Tasks</span>
                    </Button>
                  )}
              </div>
            </TaskWrapper>
          ))}
          {goal?.summary && (
            <TaskWrapper>
              <GoalTitle>
                <ReadMore text={"Tasks Summary"} />
              </GoalTitle>
              <div style={{ padding: "1rem" }}>
                {!goal.summary ? (
                  <Row style={{ gap: ".5rem", color: "#494949" }}>
                    <Image src={assets.icons.icon_brain} width={15} alt="" />
                    <span>Fetching Summary...</span>
                  </Row>
                ) : (
                  <MarkdownContent
                    content={goal.summary}
                    isDone={goal.streamingGoal && goal.summary ? true : false}
                  />
                )}
              </div>
            </TaskWrapper>
          )}
        </GoalContent>
      </GoalContentWrapper>
    </GoalWrapper>
  );
};

const TaskWrapper = styled(Column)`
  border-radius: 0.75rem;
  border: 1px solid #343434;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 auto;
`;
const GoalTitle = styled(Row)`
  padding: 1rem 0.5rem;
  gap: 0.5rem;
  font-family: var(--ff-title);
  font-size: clamp(1rem, 2vw, 1.35rem);
  border-bottom: 1px solid ${(props) => props.theme.stroke};
  margin: 0 auto;
  align-items: flex-start;
  align-items: center;

  ._titleContent {
    width: 100%;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
    max-width: ${(props) => props.theme.ctrSizes.maxAppCtrWidth};
  }

  ._copyGoalBtn {
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
const GoalTasks = styled.ul`
  padding: 0 1rem;
  li {
    margin-left: 1.5rem;
    padding: 0.25rem 0;
  }
`;
const GoalContent = styled(Column)`
  width: 100%;
  max-width: ${(props) => props.theme.ctrSizes.maxAppCtrWidth};
  padding-bottom: 0.5rem;
  gap: 1rem;
  overflow: hidden;
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
const GoalContentWrapper = styled(Column)`
  background: none;
  padding: 1rem;
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
const GoalWrapper = styled(Column)``;

export default GoalPage;
