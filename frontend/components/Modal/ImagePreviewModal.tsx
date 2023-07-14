import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import styled from "styled-components";
import { BE_URL, useChatStore } from "@/store";
import Modal from ".";
import { useAppState } from "@/context/app.context";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

const ImagePreviewModal = () => {
  const { close, open, images } = useAppState();
  const { address } = useAccount();

  return (
    <Backdrop
      onClick={() => {
        close("imagePreviewModal");
      }}
    >
      <Modal
        close={() => {
          close("imagePreviewModal");
        }}
      >
        <SiteAccessFormWrapper>
          {images.map((image) => (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ))}
        </SiteAccessFormWrapper>
      </Modal>
    </Backdrop>
  );
};
const SiteAccessFormWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 30vh;
  width: 100%;
  input,
  button {
    width: 100%;
    font-size: 0.8rem;
  }
  input {
    background: transparent;
    color: ${({ theme }) => theme.primary};
  }
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  ._title {
    font-family: var(--ff-imp);
    font-size: clamp(1.15rem, 2vw, 1.35rem);
  }
`;
export default ImagePreviewModal;
