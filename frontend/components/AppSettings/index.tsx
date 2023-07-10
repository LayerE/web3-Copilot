import React, { useState } from "react";
import styled from "styled-components";
import Row from "../common/Row";
import Column from "../common/Column";
import { Settings } from "react-feather";
import Backdrop from "../Modal/Backdrop";
import Modal from "../Modal";
import { useAppState } from "@/context/app.context";
import Image from "next/image";
import assets from "@/public/assets";
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
        _height="550px"
      >
        <AppSettingsWrapper>
          <SettingsHeader>
            <Row
              style={{
                gap: ".5rem",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Image src={assets.icons.icon_settings} width={25} alt="" />
              <span style={{ fontSize: "var(--fs-m)" }}>Settings</span>
            </Row>
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
  padding-bottom: 2rem;
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
  color: ${(props) =>
    props?.isActive ? "var(--active-color)" : "var(--disabled-color)"};
`;
const SettingsHeader = styled(Column)`
  gap: 1rem;
`;
const SettingsBody = styled(Column)``;
export default AppSettings;
