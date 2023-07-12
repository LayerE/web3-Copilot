import React from "react";
import styled from "styled-components";
import { ConnectWalletButton } from "../ConnectWalletBtn";
import { useChatStore } from "@/store";
import Row from "../common/Row";
import Button from "../common/Button";
import assets from "@/public/assets";
import Image from "next/image";
import { copyToClipboard } from "@/utils/common";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const { currentSession } = useChatStore();
  return (
    <Header>
      {currentSession()?.prompts.length > 0 ? (
        <Row style={{ gap: ".5rem" }}>
          <p className="cs_topic">{currentSession()?.topic}</p>
          <Button
            style={{ padding: 0, background: "none", fontSize: ".8rem" }}
            onClick={() => {
              copyToClipboard(
                encodeURI(
                  `${window.location.origin}/chats?chat_id=${
                    currentSession()?.conversation_id
                  }&title=${currentSession()?.topic}`
                ),
                "Session link copied!"
              );
            }}
          >
            <Image
              src={assets.icons.icon_share3}
              alt="share-button"
              width={15}
            />
            <span>Share</span>
          </Button>
        </Row>
      ) : (
        <p className="timestamp">
          {new Date()
            .toLocaleDateString("en-in", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/,/g, "")}
        </p>
      )}
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
  border: 1px solid #2f2f2f;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: absolute;
  top: 0;
  width: 100%;
  .cs_topic {
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default index;
