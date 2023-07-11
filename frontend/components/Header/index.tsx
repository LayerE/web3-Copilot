import React from "react";
import styled from "styled-components";
import { ConnectWalletButton } from "../ConnectWalletBtn";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  return (
    <Header>
      <p className="timestamp">
        {new Date()
          .toLocaleDateString("en-in", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .replace(/,/g, "")}
      </p>
      <ConnectWalletButton />
    </Header>
  );
};

const Header = styled.div`
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3rem;
  background-color: ${(props) => props.theme.bgBody};
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #2f2f2f;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: absolute;
  top: 0;
  width: 100%;
`;

export default index;
