import assets from "@/public/assets";
import { useChatStore } from "@/store";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

const PersonaIcon = ({ icon_src, size }: { icon_src?: any; size?: number }) => {
  const { currentSession } = useChatStore();

  const personaSrc = () => {
    const type = currentSession()?.type;
    switch (icon_src ?? type) {
      case "new_dev":
        return assets.icons.icon_new_dev;
      case "validator":
        return assets.icons.icon_validator;
      default:
        return assets.icons.icon_dev;
    }
  };

  return (
    <PersonaWrapper>
      {/* <Image
        src={personaSrc()}
        alt=""
        width={size ?? currentSession()?.type !== "new_dev" ? 14 : 11}
      /> */}
      <span>
        {currentSession()?.type === "new_dev"
          ? "beginner"
          : currentSession()?.type === "validator"
          ? "degen"
          : "advanced"}
      </span>
    </PersonaWrapper>
  );
};

const PersonaWrapper = styled.div`
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 6px;
  font-size: 0.7rem;
  font-family: var(--ff-light);
  background: #8a46ff90;
  border: 1px solid rgba(255, 255, 255, 0.397);
  border-radius: 2rem;
`;
export default PersonaIcon;
