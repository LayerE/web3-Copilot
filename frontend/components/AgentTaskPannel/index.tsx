import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { Book } from "react-feather";
import Row from "../common/Row";
import Button from "../common/Button";
import { Input } from "../common/Input";
import Image from "next/image";
import assets from "@/public/assets";
import { DisabledLabel } from "../common/Label";

const AgentTaskPannel = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setHeight] = useState(224);
  useEffect(() => {
    if (footerRef?.current) {
      setHeight(footerRef?.current?.scrollHeight);
    }
  }, [footerRef?.current, footerHeight]);
  return (
    <AgentTaskPannelWrapper>
      <Row gap={".25rem"} style={{ paddingBottom: "1rem" }}>
        <Book size={"1rem"} />
        <p>Current Tasks</p>
      </Row>
      <TasksCtr
        style={{
          height: `calc(100% - ${footerHeight}px)`,
        }}
      >
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
      </TasksCtr>
      <TasksFooter ref={footerRef}>
        <Input
          style={{
            background: "rgba(45, 45, 45, 0.2)",
            color: "#fff",
            height: "50px",
          }}
          placeholder="Enter task..."
        />
        <Button style={{ width: "100%" }}>Add Task</Button>
      </TasksFooter>
    </AgentTaskPannelWrapper>
  );
};

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
  padding-top: 1rem;
`;
const AgentTaskPannelWrapper = styled(Column)`
  height: 100%;
  max-width: 280px;
  padding: 1rem;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  background: #0f0f0f;
  z-index: 10;
  overflow-y: auto;
  position: relative;
`;
export default AgentTaskPannel;
