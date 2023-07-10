import React, { useEffect, useState } from "react";
import { ArrowDown } from "react-feather";
import styled from "styled-components";

const GoToBottomPageBtn = ({
  scrollToBottom,
  scrollHeight,
}: {
  scrollToBottom: any;
  scrollHeight: number;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (scrollHeight < 60) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [scrollHeight]);

  return (
    <GoDownBtn
      style={showButton ? {} : { display: "none" }}
      onClick={scrollToBottom}
    >
      <ArrowDown size={20} />
    </GoDownBtn>
  );
};

const GoDownBtn = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: #fff;
  display: grid;
  border-radius: 100%;
  place-items: center;

  background: linear-gradient(0deg, #121212, #121212), #160c27;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;
export default GoToBottomPageBtn;
