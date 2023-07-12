import styled from "styled-components";
import React, { ReactNode } from "react";
import { X, XCircle } from "react-feather";
import { motion } from "framer-motion";

import { silde } from "@/utils/variants";

import LayerELogo from "../BrandFooters/LayerELogo";
import { useChatStore } from "@/store";

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
  title,
  _class,
  _height,
}: {
  children: ReactNode;
  close: () => void;
  title?: string;
  _class?: string;
  _height?: string;
}) => {
  const { credits } = useChatStore();
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
          <p>{title}</p>
          <X color={"#535357"} size={"1rem"} />
        </CloseBtn>
        <ModelContent>{children}</ModelContent>

        <ModalFooter>
          <Credits>
            Current credit balance: <span>{credits}</span>
          </Credits>
        </ModalFooter>
      </div>
    </ModalWrapper>
  );
};
const ModelContent = styled.div`
  max-height: 70vh;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 1.5rem;
`;
const Credits = styled.p`
  border-radius: 5rem;
  padding: 0.15rem 0.5rem;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  span {
    color: ${(props) => props.theme.imp};
  }
`;
const ModalFooter = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
`;
export default Modal;
const CloseBtn = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 100%;
  top: 0rem;
  font-size: 0.9rem;
  right: 0rem;
  cursor: pointer;
`;
const ModalWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 95%;
  max-width: 500px;
  padding: 1.5px;
  position: relative;
  border-radius: 1rem;
  background: ${(props) => props.theme.bgModal};
  z-index: 1001;
  ._content {
    flex-grow: 1;
    width: 100%;
    padding: 3.5rem 0rem; //extra padding for footer and header
    border-radius: 1rem;
    display: flex;
    position: relative;
  }
`;
