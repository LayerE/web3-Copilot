import React, { useState } from "react";
import styled from "styled-components";
import Row from "../common/Row";
import Column from "../common/Column";
import Backdrop from "../Modal/Backdrop";
import Modal from "../Modal";
import { useAppState } from "@/context/app.context";
import UserAPI from "../Modal/APIModal";
import ConnectSocials from "../Modal/ConnectSocials";
import EarnCredits from "../Modal/EarnCredits";

const TAB_DATA = [
  {
    tab_id: 1,
    label: "Profile",
  },
  {
    tab_id: 2,
    label: "Responses",
  },
  {
    tab_id: 3,
    label: "Credits",
  },
];

const RenderTabContent = (id: number) => {
  switch (id) {
    case 2:
      return <UserAPI />;
    case 1:
      return <ConnectSocials />;
    case 3:
      return <EarnCredits />;
    default:
      return <UserAPI />;
  }
};
const AppSettings = () => {
  const { close, tabID, setTabID } = useAppState();

  return (
    <Backdrop onClick={() => close("showAppSettings")}>
      <Modal
        close={() => close("showAppSettings")}
        _class="tour_settings"
        _height="540px"
        title="Settings"
      >
        <AppSettingsWrapper>
          <SettingsHeader>
            <SettingsNav>
              {TAB_DATA?.map((tab) => (
                <Tab
                  key={tab?.tab_id + tab?.label}
                  isActive={tab?.tab_id === tabID}
                  onClick={() => setTabID(tab?.tab_id)}
                  className={`tour_${tab?.label
                    ?.split(" ")
                    ?.join("")
                    ?.toLowerCase()}`}
                >
                  {tab?.label}
                </Tab>
              ))}
            </SettingsNav>
          </SettingsHeader>
          <SettingsBody>{RenderTabContent(tabID)}</SettingsBody>
        </AppSettingsWrapper>
      </Modal>
    </Backdrop>
  );
};

const AppSettingsWrapper = styled(Column)`
  --disabled-color: #807f8b;
  --active-color: #fff;
  --stroke: #67666e;
  width: 100%;
  gap: 1rem;
`;
const SettingsNav = styled(Row)`
  gap: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--stroke);
`;
const Tab = styled.button<{ isActive?: boolean }>`
  background: none;
  outline: none;
  border: none;
  position: relative;
  transition: all 0.4s ease;
  color: ${(props) =>
    props?.isActive ? "var(--active-color)" : "var(--disabled-color)"};
  &::after {
    content: "";
    transition: width 0.2s ease;
    position: absolute;
    bottom: -8px;
    left: 0;
    width: ${(props) => (props?.isActive ? "100%" : 0)};
    padding: ${(props) => (props?.isActive ? "1px" : 0)};
    background: ${(props) =>
      props?.isActive ? "var(--active-color)" : "var(--disabled-color)"};
  }
`;
const SettingsHeader = styled(Column)`
  gap: 1rem;
`;
const SettingsBody = styled(Column)``;
export default AppSettings;
