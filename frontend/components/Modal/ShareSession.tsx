import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from ".";
import Backdrop from "./Backdrop";
import { TEXT } from "@/theme/texts";
import { BE_URL, useChatStore } from "@/store";
import { ReferralCode } from "./ReferralInfo";
import Button, { GlowBtn } from "../common/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import Row from "../common/Row";
import LoadingIcon from "../LoadingIcon";
import { CheckCircle } from "react-feather";
import { copyToClipboard } from "@/utils/common";

const ShareSession = () => {
  const { close, open, link } = useAppState();

  return (
    <Backdrop onClick={() => close("shareSessionModal")}>
      <Modal close={() => close("shareSessionModal")}>
        <EarnCreditsWrapper>
          <TEXT.Body size="var(--fs-m)">Share Session</TEXT.Body>

          <span
            style={{
              width: "90%",
              color: "grey",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {link}
          </span>
          <Row
            gap="1rem"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={() => {
                window?.innerWidth < 768
                  ? navigator?.share(link as any)
                  : copyToClipboard(link, "Session link copied!");
              }}
            >
              {window?.innerWidth < 768 ? "Share" : "Copy Link"}
            </Button>
            <Button
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${link}`,
                  "_blank"
                );
              }}
            >
              Tweet
            </Button>
          </Row>
        </EarnCreditsWrapper>
      </Modal>
    </Backdrop>
  );
};

const TasksBtns = styled.div`
  display: flex;
  width: 100%;
  gap: 0.5rem;

  button {
    width: fit-content;
    &:nth-of-type(1) {
      flex: 1;
    }
  }
`;
const CreditBtn = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--ff-light);
  border-radius: 0.5rem;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  padding: 0.35rem 0.5rem;
  width: 100%;
`;
const EarnCreditsWrapper = styled(motion.div)`
  display: grid;
  width: 100%;
  place-items: center;
  gap: 1rem;
  text-align: center;
`;
export default ShareSession;
