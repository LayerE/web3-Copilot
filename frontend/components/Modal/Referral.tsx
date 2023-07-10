import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React, { FormEvent, useRef, useState } from "react";
import styled from "styled-components";
import Modal from ".";
import Backdrop from "./Backdrop";
import { TEXT } from "@/theme/texts";
import Button, { AppBtn, GlowBtn } from "../common/Button";
import { Input } from "../common/Input";
import { BE_URL, useChatStore } from "@/store";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoadingIcon from "../LoadingIcon";

const Referral = () => {
  const { close } = useAppState();
  const { jwt, api_key, updateUserInfo } = useChatStore();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitReferralCode = async (refCode: any) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BE_URL}/task/verify`,
        {
          taskID: 4,
          referralCode: refCode,
        },
        {
          headers: {
            authorization: jwt ?? null,
            apikey: api_key ?? null,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Referral Code Submitted!");
        updateUserInfo();
      } else {
        toast.error("Submission failed, retry!");
      }
    } catch {
      toast.error("Submission failed, retry!");
    } finally {
      setLoading(false);
      close('referralModal')
    }
  };
  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    let code = inputRef?.current?.value as string;
    submitReferralCode(code);
  };
  return (
    <Backdrop onClick={() => close("referralModal")}>
      <Modal close={() => close("referralModal")}>
        <RefferalWrapper>
          <TEXT.Body size="var(--fs-m)">Enter referral code</TEXT.Body>
          <TEXT.Disabled size="var(--fs-s)">
            Enter your code to earn 6 credits.
          </TEXT.Disabled>
          <ReferralForm onSubmit={onFormSubmit}>
            <Input
              placeholder="Enter referral code"
              type="text"
              required
              ref={inputRef}
            />
            <Button style={{ width: "200px" }}>
              {loading ? <LoadingIcon /> : "Submit"}
            </Button>
          </ReferralForm>
          <Button
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              fontSize: ".9rem",
              color: "#807F8B",
            }}
            onClick={() => close("referralModal")}
          >
            Skip
          </Button>
        </RefferalWrapper>
      </Modal>
    </Backdrop>
  );
};

const ReferralForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  align-items: center;
  gap: 1rem;
  input,
  button {
    width: 100%;
  }
  input {
    background: transparent;
    color: ${({ theme }) => theme.primary};
  }
`;
const RefferalWrapper = styled(motion.div)`
  display: grid;
  place-items: center;
  gap: 1rem;
  text-align: center;
  width: 100%;
`;
export default Referral;
