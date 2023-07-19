import Button from "@/components/common/Button";
import Row from "@/components/common/Row";
import { useAppState } from "@/context/app.context";
import { useChatStore } from "@/store";
import { useRouter } from "next/router";
import React from "react";
import { Menu } from "react-feather";
import styled from "styled-components";

const MobNav = () => {
  const { currentSession } = useChatStore();
  const { open, close } = useAppState();
  const router = useRouter();
  return (
    <MobNavWrapper>
      <Button
        style={{ background: "none", padding: 0 }}
        onClick={() => open("showSidebar")}
      >
        <Menu />
      </Button>

      <span style={{ margin: "0 auto" }}>{currentSession()?.topic}</span>
      {router.pathname === "/agent" && (
        <Button
          style={{ background: "none", padding: 0 }}
          onClick={() => open("showTaskPannel")}
        >
          <Menu />
        </Button>
      )}
    </MobNavWrapper>
  );
};

const MobNavWrapper = styled(Row)`
  position: fixed;
  top: 0;
  padding: 1rem;
  justify-content: space-between;
  display: none;

  ${(props) => props.theme.mediaWidth.upToMedium`
    display:flex;
  `}
`;
export default MobNav;
