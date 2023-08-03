import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React, { FormEvent, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Modal from ".";
import Backdrop from "./Backdrop";
import { TEXT } from "@/theme/texts";
import Button, { AppBtn, GlowBtn } from "../common/Button";
import { Input } from "../common/Input";
import { BE_URL, useChatStore } from "@/store";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoadingIcon from "../LoadingIcon";
import Row from "../common/Row";
import Column from "../common/Column";

const ToolsModal = () => {
  const { close } = useAppState();
  const { agents, setAgents } = useChatStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const checkbox = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    if (e.target.checked) {
      setAgents([...agents, e.target.value]);
    } else {
      setAgents(agents.filter((agent: any) => agent !== e.target.value));
    }
  };

  const FetchAllAvailableTools = async () => {
    try {
      const res = await axios.get(`${BE_URL}/agent/tools`);
      return res.data;
    } catch (error) {
      return [];
    }
  };
  const [toolsData, setToolsData] = useState<any>([]);
  useEffect(() => {
    FetchAllAvailableTools().then((res) => setToolsData(res?.availableTools));
  }, []);
  return (
    <Backdrop onClick={() => close("toolsModal")}>
      <Modal close={() => close("toolsModal")}>
        <RefferalWrapper>
          <TEXT.Body size="var(--fs-m)">Available Agents</TEXT.Body>
          <TEXT.Disabled size="var(--fs-s)">
            <Column style={{ gap: ".35rem" }}>
              {toolsData?.length! &&
                toolsData?.map((tool: any, index: number) => (
                  <Row
                    style={{
                      justifyContent: "space-between",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <TEXT.Body size="var(--fs-s)">{tool?.toolName}</TEXT.Body>
                    <Swtich>
                      <input
                        type="checkbox"
                        readOnly
                        value={tool?.toolName}
                        onClick={handleClick}
                        ref={checkbox}
                        checked={agents.includes(tool?.toolName)}
                      />
                      <span className="slider"></span>
                    </Swtich>
                  </Row>
                ))}
            </Column>
          </TEXT.Disabled>
          {agents?.length === 0 && (
            <TEXT.Body size="var(--fs-s)">
              By default, all agents are considered since no specific agent is
              selected.
            </TEXT.Body>
          )}
        </RefferalWrapper>
      </Modal>
    </Backdrop>
  );
};
const Swtich = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    border-radius: 2rem;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #636363;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    &:before {
      position: absolute;
      content: "";
      height: 15px;
      width: 15px;
      left: 5px;
      bottom: 2.5px;
      border-radius: 2rem;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
  }
  input:checked + .slider {
    background-color: ${(props) => props.theme.btnPrimary};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${(props) => props.theme.btnPrimary};
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(17px);
    -ms-transform: translateX(17px);
    transform: translateX(17px);
  }
`;
const ToolsWrapper = styled.form`
  display: flex;
  width: 100%;

  border-radius: 0.5rem;
  background: var(--color-bg-1);
  box-shadow: var(--shadow-1);
  margin-bottom: 1rem;
`;
const RefferalWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  text-align: center;
  width: 100%;
`;
export default ToolsModal;
