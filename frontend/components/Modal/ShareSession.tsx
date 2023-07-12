import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import Modal from ".";
import Backdrop from "./Backdrop";
import Button from "../common/Button";
import Row from "../common/Row";
import { copyToClipboard } from "@/utils/common";
import { Copy, Twitter } from "react-feather";

const ShareSession = () => {
  const { close, open, link } = useAppState();

  return (
    <Backdrop onClick={() => close("shareSessionModal")}>
      <Modal close={() => close("shareSessionModal")} title="Share Session">
        <EarnCreditsWrapper>
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
            }}
          >
            <Button
              style={{ width: "120px", fontSize: ".8rem" }}
              onClick={() => {
                window?.innerWidth < 768
                  ? navigator?.share(link as any)
                  : copyToClipboard(link, "Session link copied!");
              }}
            >
              <Copy size={"1rem"} />
              {window?.innerWidth < 768 ? "Share" : "Copy Link"}
            </Button>
            <Button
              style={{
                width: "120px",
                fontSize: ".8rem",
              }}
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${link}`,
                  "_blank"
                );
              }}
            >
              <Twitter size={"1rem"} />
              <span>Tweet</span>
            </Button>
          </Row>
        </EarnCreditsWrapper>
      </Modal>
    </Backdrop>
  );
};

const EarnCreditsWrapper = styled(motion.div)`
  display: grid;
  width: 100%;
  place-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem 0;
`;
export default ShareSession;
