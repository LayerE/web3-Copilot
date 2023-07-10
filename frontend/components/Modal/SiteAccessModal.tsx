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

const codes = [
  "T8K4J7","E2F9G6","P6D5S1","X1R7M9","B9N2C3","LayerE#123"
]
const SiteAccessForm = () => {
  const { close, open } = useAppState();
  const { address } = useAccount();
  const { updateSiteAccessStatus, updateLoginStatus, updateJWT, credits } =
    useChatStore();
  const [code, setCode] = useState("");
  const { open: openModal } = useWeb3Modal();
  const onCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (codes.includes(code)) {
      updateSiteAccessStatus(true);
      toast.success("Access Granted!");
      localStorage.setItem("code", code);
      openModal();
      close("siteAccessForm");
    } else {
      updateSiteAccessStatus(false);
      toast.error("Invalid Secret Code!");
      close("siteAccessForm");
    }
  };

  return (
    <Backdrop
      onClick={() => {
        close("siteAccessForm");
      }}
    >
      <Modal
        close={() => {
          close("siteAccessForm");
        }}
      >
        <SiteAccessFormWrapper>
          <p className="_title">Enter Secret key to access the beta program</p>
          <form style={{ width: "100%" }} onSubmit={onCodeSubmit}>
            <Input
              type="text"
              required
              placeholder="Enter key here..."
              onChange={(e: any) => setCode(e.target.value)}
            />
            <Button>Submit</Button>
          </form>
          <Button
            onClick={() => {
              open("earlyBirdForm");
              close("siteAccessForm");
            }}
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          >
            I don{"’"}t have a secret Key!
          </Button>
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
export default SiteAccessForm;
