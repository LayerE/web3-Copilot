import styled from "styled-components";
import React, { ReactNode } from "react";
import { X, XCircle } from "react-feather";
import { motion } from "framer-motion";

import { silde } from "@/utils/variants";

import LayerELogo from "../BrandFooters/LayerELogo";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Modal = ({
  children,
  close,
  _class,
  _height,
}: {
  children: ReactNode;
  close: () => void;
  _class?: string;
  _height?: string;
}) => {
  return (
    <ModalWrapper
      onClick={(e) => e.stopPropagation()}
      variants={silde("down")}
      initial="initial"
      animate="animate"
      exit="exit"
      className={_class ?? ""}
    >
      <div className="_content" style={_height ? { minHeight: _height } : {}}>
        <CloseBtn onClick={close}>
          <X color={"#535357"} size={"1rem"} />
        </CloseBtn>
        {children}
        <ModalFooter>
          <LayerELogo />
        </ModalFooter>
      </div>
    </ModalWrapper>
  );
};

const ModalFooter = styled.div`
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
`;
export default Modal;
const CloseBtn = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;
const ModalWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 95%;
  max-width: 550px;
  max-height: 90vh;
  padding: 1.5px;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  overflow-y: auto;

  background: #363636;
  z-index: 1001;
  ._content {
    background: #141414;
    flex-grow: 1;
    width: 100%;
    padding: 2rem 1.5rem;
    border-radius: 1rem;
    display: flex;
    max-height: 90vh;
    overflow: hidden;
    overflow-y: auto;
    position: relative;
  }
`;
