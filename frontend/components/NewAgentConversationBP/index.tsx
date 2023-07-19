import React, { ChangeEvent, useRef, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import assets from "@/public/assets";
import { ResponsiveRow } from "../common/Row";
import Image from "next/image";
import { ArrowRightCircle } from "react-feather";
import { theme } from "@/theme";
import Header from "../Header";
import Button from "../common/Button";
import { DisabledLabel } from "../common/Label";
import { Input } from "../common/Input";
import { useChatStore } from "@/store";

const NewAgentAI = () => {
  const { addSessionGoal, currentSession } = useChatStore();
  const formRef = useRef<HTMLFormElement>(null);
  const goalInputRef = useRef<HTMLTextAreaElement>(null);
  const agentInputRef = useRef<HTMLInputElement>(null);
  const onGoalFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (agentInputRef.current && goalInputRef.current) {
      let goal_title = goalInputRef.current.value;
      let agent_name = agentInputRef.current.value;
      addSessionGoal(goal_title, currentSession().id, agent_name);
    }
    formRef.current?.reset();
  };
  return (
    <NewAgentAIWrapper>
      <Column
        style={{
          width: "100%",
          height: "100%",
          gap: "clamp(1rem,3vw,2rem)",
          maxWidth: `${theme().ctrSizes.maxAppCtrWidth}`,
        }}
      >
        <ResponsiveRow
          style={{
            justifyContent: "flex-start",
            gap: "1rem",
          }}
        >
          <Image src={assets.logos.logo_agentAI} alt="" width={70} />
          <Column
            style={{
              width: "fit-content",
            }}
          >
            <AppTitle>
              <span>AI Agent</span>
            </AppTitle>
            <DisabledLabel>
              Wormhole theme, Excess blue and black, visible sidebar.
            </DisabledLabel>
          </Column>
        </ResponsiveRow>
        <MainContent>
          <Goals>
            {goals.map((goal, idx) => (
              <GoalCard
                key={idx}
                onClick={() => {
                  if (agentInputRef.current && goalInputRef.current) {
                    agentInputRef.current.value = goal.agent_name ?? "";
                    goalInputRef.current.value = goal.goal ?? "";
                  }
                }}
              >
                <p className="_agent_name">{goal.agent_name}</p>
                <p className="_goal">{goal.goal}</p>
              </GoalCard>
            ))}
          </Goals>
          <GoalForm onSubmit={onGoalFormSubmit} ref={formRef}>
            <label>
              <p>Agent Name</p>
              <Input
                placeholder="Enter agent name..."
                required
                ref={agentInputRef}
              />
            </label>
            <label>
              <p>Goal</p>
              <textarea
                placeholder="Enter your goal..."
                required
                ref={goalInputRef}
              />
            </label>
            <Button style={{ width: "200px" }}>
              <ArrowRightCircle size={16} />
              <span>Continue</span>
            </Button>
          </GoalForm>
        </MainContent>
      </Column>
    </NewAgentAIWrapper>
  );
};

const GoalForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
  textarea,
  input {
    color: #fff;
    background: #181818;
    border: none;
    margin-top: 0.5rem;
    width: 100%;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  textarea {
    width: 100%;
    height: 150px;
    box-sizing: border-box;
    resize: none;
  }
`;

const MainContent = styled(Column)`
  flex: 1;
`;
const AppTitle = styled.h2`
  font-family: var(--ff-light);
  gap: 0.25rem;
  font-size: clamp(1.75rem, 4vw, 3rem);
  color: #eee7f9;
  position: relative;
  display: flex;
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
  ${(props) => props.theme.mediaWidth.upToMedium`
    justify-content:center;
  `}
`;
const Goals = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: none;
  overflow: hidden;
  overflow-x: auto;
  ${(props) => props.theme.hideScrollBar}
`;
const GoalCard = styled(Column)`
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.bgCard};
  gap: 0.5rem;
  font-family: var(--ff-imp-reg);
  transition: 0.2s ease;
  position: relative;
  padding-bottom: 2rem;
  width: 300px;
  min-width: 300px;
  cursor: pointer;
  ._goal {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
  }
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
    width: 25px;
    height: 25px;
    overflow: hidden;
    padding: 0.15rem 0.35rem;
    border-radius: 100%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  height:auto;
  font-size:.9rem;
  `}
`;
const NewAgentAIWrapper = styled(Column)`
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

export default NewAgentAI;
export const goals = [
  {
    agent_name: "PlatformerGPT",
    goal: "Write some code to make a platromer game.",
  },
  {
    agent_name: "ResearchGPT",
    goal: "Create a comprehensive report of the Meta Stock",
  },
];
