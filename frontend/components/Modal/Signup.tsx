import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import styled from "styled-components";
import { useChatStore } from "@/store";
import Modal from ".";
import { useAppState } from "@/context/app.context";
import { ConnectWalletButton } from "../ConnectWalletBtn";
import assets from "@/public/assets";
import Image from "next/image";
import { useState } from "react";
import { colors } from "@/theme/colors";

const Signup = () => {
  const { close, open } = useAppState();
  const { updateSiteAccessStatus, hasSiteAccess } = useChatStore();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      updateSiteAccessStatus(true);
    } else {
      updateSiteAccessStatus(false);
    }
  };

  return (
    <Backdrop onClick={() => close("signUpModal")}>
      <Modal close={() => close("signUpModal")} title="Signup">
        <SignupWrapper>
          <div id={"signup-modal"}>
            <Image
              src={assets.logos.logo_signup}
              alt=""
              width={100}
              style={{
                borderRadius: "2rem",
              }}
            />
          </div>
          <ConnectWalletButton
            bg={hasSiteAccess ? colors()?.btnPrimary : "#333333"}
          />
          <Terms>
            <Checkbox>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="_checkmark"></span>
            </Checkbox>
            Before proceeding, kindly review and agree to our{" "}
            <a
              href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/terms-of-use"
              target="_blank"
            >
              Terms of Service
            </a>
            ,{" "}
            <a
              href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/cookie-policy"
              target="_blank"
            >
              Cookie Policy
            </a>
            , and{" "}
            <a
              href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/privacy-policy"
              target="_blank"
            >
              Privacy Policy.
            </a>
          </Terms>
        </SignupWrapper>
      </Modal>
    </Backdrop>
  );
};

const Checkbox = styled.label`
  --size: 1rem;
  --border: 1.5px;

  position: relative;
  input[type="checkbox"] {
    appearance: none;
  }
  ._checkmark {
    position: absolute;
    left: -17px;
    transform: translateY(10%);
    height: var(--size);
    border-radius: 5px;
    border: var(--border) solid grey;
    width: var(--size);
    transition: 100ms ease-in;
    cursor: pointer;
  }

  input:checked + ._checkmark {
    background: ${(props) => props.theme.btnPrimary};
    border: var(--border) solid #fff;
  }
`;

const SignupWrapper = styled(motion.div)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 30vh;
  ._title {
    font-size: clamp(1rem, 2vw, 1.15rem);
    font-family: var(--ff-light);
    color: #cfcfcf;
  }
`;

const Terms = styled.p`
  color: #adadad;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  padding: 0.5rem;
  border-radius: 0.5rem;
  a {
    color: rgba(255, 78, 78, 1);
  }
  input {
    margin-right: 0.25rem;
    transform: translateY(10%);
  }
`;
export default Signup;
