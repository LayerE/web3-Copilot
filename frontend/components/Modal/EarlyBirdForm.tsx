import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import styled from "styled-components";
import Modal from ".";
import { useAppState } from "@/context/app.context";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BE_URL } from "@/store";

const EarlyBirdForm = () => {
  const { close } = useAppState();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const postEmail = async (_email: string) => {
    setSubmitting(true);
    try {
      const res = await axios.post(BE_URL + "/early-access", { email: _email });
      if (res.status === 200) {
        toast.success("Email Submitted!");
      }
    } catch {
      toast.error("Error submitting email!");
    } finally {
      setSubmitting(false);
      close("earlyBirdForm");
    }
  };
  const onEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    postEmail(email);
  };
  return (
    <Backdrop
      onClick={() => {
        close("earlyBirdForm");
      }}
    >
      <Modal
        close={() => {
          close("earlyBirdForm");
        }}
      >
        <EarlyBirdFormWrapper>
          <p className="_title">
          Enter your email to sign up for the closed, beta!
           We will be in touch with you soon.
          </p>
          <form style={{ width: "100%" }} onSubmit={onEmailSubmit}>
            <Input
              type="email"
              required
              placeholder="Enter your email to sign up here"
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Button>{submitting ? "Submitting..." : "Submit"}</Button>
          </form>
        </EarlyBirdFormWrapper>
      </Modal>
    </Backdrop>
  );
};
const EarlyBirdFormWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 30vh;
  width: 100%;
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    input,
    button {
      width: 100%;
      font-size: 0.8rem;
    }
    input {
      background: transparent;
      color: ${({ theme }) => theme.primary};
    }
  }
  ._title {
    font-family: var(--ff-imp);
    font-size: 1.15rem;
  }
`;
export default EarlyBirdForm;
