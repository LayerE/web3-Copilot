import React from "react";
import Row from "../common/Row";
import Image from "next/image";
import assets from "@/public/assets";
import { DisabledLabel } from "../common/Label";
import styled from "styled-components";

const ChatGPTLogo = () => {
  return (
    <ChatGPT
      onClick={() => window.open("https://openai.com/blog/chatgpt", "_blank")}
    >
      <DisabledLabel style={{ fontSize: ".7rem", color: "#fff" }}>
        Powered by GPT-4
      </DisabledLabel>
      <Image
        src={assets.logos.logo_gpt}
        alt=""
        width={13}
        style={{ borderRadius: "2rem" }}
      />
    </ChatGPT>
  );
};
const ChatGPT = styled(Row)`
  justify-content: center;
  width: fit-content;
  padding: 0.1rem 0.2rem;
  gap: 0.25rem;
  padding-left: 0.5rem;
  border-radius: 1rem;
  background: none;
  cursor: pointer;
  border: 1px solid #2a2a2a;
  transition: 0.4s ease;
`;

export default ChatGPTLogo;
