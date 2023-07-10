import { useChatStore } from "@/store";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { DisabledLabel } from "../common/Label";

export const models = [
  {
    model_id: 1,
    gpt_id: "3.5",
    model_name: "GPT-3.5 Turbo",
  },

  {
    model_id: 2,
    gpt_id: "4",
    model_name: "GPT-4",
  },
];
const GPTModelDropDown = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { setGPTModel, gptModel } = useChatStore();
  const [selectedModel, setSelectedModel] = useState(1);
  const selectModel = (model: any) => {
    setSelectedModel(model.model_id);
    setGPTModel(model);
    setShowMenu(false);
  };
  useEffect(() => {
    if (gptModel) {
      setSelectedModel(gptModel.model_id);
    }
  }, []);
  return (
    <GPTModelDropDownWrapper>
      <span>Model</span>
      <Selector onClick={() => setShowMenu((prev) => !prev)}>
        <SelectedItem>{models[selectedModel - 1].model_name}</SelectedItem>
        <Caret isClicked={showMenu ? 1 : 0} />
      </Selector>
      <Menu show={showMenu ? 1 : 0}>
        {models?.map((model) => (
          <Item key={model.gpt_id} onClick={() => selectModel(model)}>
            {model.model_name}
          </Item>
        ))}
      </Menu>
      <DisabledLabel style={{ fontSize: ".9rem" }}>
        {gptModel?.gpt_id === "4"
          ? "Note : GPT-4 uses 3 credits per query."
          : "Note : GPT-3.5 uses 1 credit per query."}
      </DisabledLabel>
    </GPTModelDropDownWrapper>
  );
};

const GPTModelDropDownWrapper = styled(Column)`
  width: 250px;
  position: relative;
  text-align: left;
  gap: 0.25rem;
`;
const Selector = styled.div`
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${(props) => props.theme.stroke};
  border-radius: 0.5em;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
`;
const Menu = styled.ul<{ show?: number }>`
  list-style: none;
  padding: 0.2rem 0.5rem;
  background: #1c1c1c;
  border: 2px solid ${(props) => props.theme.stroke};
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  color: #9fa5b5;
  position: absolute;
  top: 4.75rem;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  opacity: ${(props) => (props?.show === 0 ? 0 : 1)};
  display: ${(props) => (props?.show === 0 ? "none" : "block")};
  transition: 0.2s;
  z-index: 1;
`;
const Item = styled.li`
  padding: 0.5rem;
  margin: 0.3em 0;
  border-radius: 0.5em;
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
`;
const SelectedItem = styled.span``;
const Caret = styled.div<{ isClicked?: number }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #fff;
  transition: 0.3s;
  transform: ${(props) => (props.isClicked === 0 ? "" : "rotate(180deg)")};
`;
export default GPTModelDropDown;
