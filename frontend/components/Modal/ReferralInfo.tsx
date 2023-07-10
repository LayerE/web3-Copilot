import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import styled from "styled-components";
import Modal from ".";
import Backdrop from "./Backdrop";
import { TEXT } from "@/theme/texts";
import { useChatStore } from "@/store";
import Row from "../common/Row";
import { Clipboard } from "react-feather";
import { HideSmall } from "../common/MdQryBlock";
import { copyToClipboard } from "@/utils/common";
import Button, { GlowBtn } from "../common/Button";
import UserAPI from "./APIModal";
import Column from "../common/Column";

export const ReferralCode = () => {
  const { user } = useChatStore();
  return (
    <ReferralCodeWrapper>
      <span>{user?.referralCode}</span>
      <Button
        onClick={() => {
            //@ts-ignore
        if (window?.gtag) {
      //@ts-ignore
      window?.gtag("event", "referral_code_copied", {
        event_category: "referral_code_copied",
        event_name: "referral_code_copied",
        event_label: "referral_code_copied",
      });
    }
          copyToClipboard(user?.referralCode)}
  }
        style={{
          background: "#2F2F2F",
          width: "fit-content",
          padding: ".25rem",
          fontSize: ".8rem",
          gap: ".25rem",
          borderRadius: ".25rem",
        }}
      >
        <TEXT.SmallBody>Copy</TEXT.SmallBody>
        <Clipboard size="1rem" />
      </Button>
    </ReferralCodeWrapper>
  );
};
const ReferralCodeWrapper = styled(Row)`
  border: 1px solid;
  justify-content: space-between;
  gap: 1rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  padding: 0.5rem;
  background: #1f1f1f;
  border: 1px solid #303030;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--ff-imp-reg);
  span {
    width: 200px;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
const ReferralInfo = () => {
  const { open, close } = useAppState();
  const { user, api_key } = useChatStore();
  const onEarnCredits = () => {
    close("referralInfoModal");
    open("earnCreditsModal");
  };
  const [timeLeft, setTimeLeft] = React.useState(0);
  useEffect(() => {
    if (user?.tokenRefreshTime) {
      // add 24 hours to the date
      let newTime = new Date(user?.tokenRefreshTime)?.getTime() + 86400000;
      let timeLeft =
        new Date(newTime).getTime() - new Date().getTime();
      setTimeLeft(timeLeft);
      const interval = setInterval(() => {
        timeLeft =
          new Date(newTime).getTime() - new Date().getTime();
        setTimeLeft(timeLeft);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [user?.tokenRefreshTime]);
  return (
    <Backdrop onClick={() => close("referralInfoModal")}>
      <Modal close={() => close("referralInfoModal")}>
        <RefferalInfoWrapper>
          {api_key ? null : (
            <Column style={{ alignItems: "center", gap: "1rem" }}>
              <TEXT.ImpText size="var(--fs-l)">Your Credits</TEXT.ImpText>
              <Balance>Credit Balance : {user?.tokens}</Balance>

              <TEXT.SmallBody>
                You will get 15 credits in{" "}
                <span
                  style={{
                    background: "#5c2da7b1",
                    padding: ".009rem .5rem",
                    borderRadius: ".25rem",
                  }}
                >
                  {Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} h{" "}
                  {Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))} m{" "}
                  {Math.floor((timeLeft % (1000 * 60)) / 1000)} s
                </span>
              </TEXT.SmallBody>
            </Column>
          )}

          <UserAPI />
        </RefferalInfoWrapper>
      </Modal>
    </Backdrop>
  );
};
const Balance = styled.div`
  background: #1f1f1f;
  border: 1px solid #303030;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-family: var(--ff-subtitle);
`;
const RefferalInfoWrapper = styled(motion.div)`
  display: grid;
  place-items: center;
  gap: 1rem;
  text-align: center;
`;
export default ReferralInfo;
