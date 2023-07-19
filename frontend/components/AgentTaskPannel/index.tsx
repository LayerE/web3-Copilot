import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { Book, XCircle } from "react-feather";
import Row from "../common/Row";
import Button from "../common/Button";
import { Input } from "../common/Input";
import Image from "next/image";
import assets from "@/public/assets";
import { DisabledLabel } from "../common/Label";
import { useChatStore } from "@/store";
import { useAppState } from "@/context/app.context";

const AgentTaskPannel = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  const [footerHeight, setHeight] = useState(224);
  const { currentSession, addTaskToCurrentGoal } = useChatStore();
  const { showModal, close } = useAppState();
  const formRef = useRef<HTMLFormElement>(null);
  const addTask = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let sessionID = currentSession().id;
    let goalID = currentSession().goals[currentSession().goals.length - 1].id;
    addTaskToCurrentGoal(
      taskTitle as string,
      goalID as string,
      sessionID as string
    );
    formRef.current?.reset();
  };
  useEffect(() => {
    if (footerRef?.current) {
      setHeight(footerRef?.current?.scrollHeight);
    }
  }, [footerRef?.current, footerHeight]);

  return (
    <AgentTaskPannelWrapper showTaskPannel={showModal.showTaskPannel}>
      <Row
        gap={".25rem"}
        style={{ padding: "1rem", justifyContent: "space-between" }}
      >
        <Row gap={".25rem"}>
          <Book size={"1rem"} />
          <p>Current Tasks</p>{" "}
        </Row>
        {showModal.showTaskPannel ? (
          <Button
            style={{ background: "none" }}
            onClick={() => close("showTaskPannel")}
          >
            <XCircle />
          </Button>
        ) : null}
      </Row>
      <TasksCtr
        style={{
          height: `calc(100% - ${footerHeight}px)`,
        }}
      >
        {currentSession()?.goals[currentSession()?.goals?.length - 1]?.tasks ? (
          <TasksList>
            {currentSession()?.goals[
              currentSession()?.goals?.length - 1
            ]?.tasks?.map((task, idx) => (
              <Task
                key={task.id}
                style={
                  task?.taskFullyLoaded ? { border: "1px solid #004819" } : {}
                }
              >
                <div className="_task_status">
                  {task?.taskFullyLoaded ? (
                    <Image src={assets.icons.icon_task_done} alt="task_done" />
                  ) : task?.streamingTask ? (
                    <Image
                      src={assets.icons.icon_task_fetching}
                      alt="task_fetching"
                      height={12}
                    />
                  ) : null}
                </div>
                <span>{task.title}</span>
              </Task>
            ))}
          </TasksList>
        ) : (
          <Column
            style={{
              padding: ".5rem",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Image src={assets.logos.logo_signup} alt="" width={70} />
            <DisabledLabel style={{ textAlign: "center" }}>
              Wormhole theme, Excess blue and black, visible sidebar, improper
              point system, unorganized glassmorphism
            </DisabledLabel>
          </Column>
        )}
      </TasksCtr>
      <TasksFooter ref={footerRef}>
        <form onSubmit={addTask} ref={formRef}>
          <Input
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              height: "50px",
              border: "none",
              borderRadius: ".5rem",
            }}
            disabled={
              currentSession().goals.length === 0 ||
              !currentSession()?.goals?.slice(-1)[0]?.summary ||
              currentSession()?.goals?.slice(-1)[0]?.streamingGoal
            }
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task..."
            required
          />
          <Button
            style={{ width: "100%", gap: ".5rem", padding: ".75rem" }}
            disabled={
              currentSession().goals.length === 0 ||
              !currentSession()?.goals?.slice(-1)[0]?.summary ||
              currentSession()?.goals?.slice(-1)[0]?.streamingGoal
            }
          >
            <Image src={assets.icons.icon_task_add} alt="add_task" />
            <span>Add Task</span>
          </Button>
        </form>
      </TasksFooter>
    </AgentTaskPannelWrapper>
  );
};

const Task = styled.div`
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  ._task_status {
    min-width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.25rem;
    border-radius: 0.25rem;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.02);
    background: rgba(255, 255, 255, 0.09);
  }
`;
const TasksList = styled(Column)`
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  gap: 1rem;
  padding: 1rem;
`;
const TasksCtr = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  overflow-y: auto;
`;
const TasksFooter = styled(Column)`
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid ${(props) => props.theme.stroke};
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;
const AgentTaskPannelWrapper = styled(Column)<{ showTaskPannel: boolean }>`
  height: 100%;
  max-width: 280px;
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
   transition:height .2s ease;
   height:${props.showTaskPannel ? "100%" : 0};
   z-index:999;    
   border:0;
  `};
`;
export default AgentTaskPannel;
