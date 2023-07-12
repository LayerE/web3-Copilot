import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ModalBtn } from "../common/Button";
import { Input } from "../common/Input";
import { BE_URL, useChatStore } from "@/store";
import { toast } from "react-hot-toast";
import { ArrowUpRight, CheckCircle, Key } from "react-feather";
import axios from "axios";
import Row from "../common/Row";
import Column from "../common/Column";
import { ReferralCode } from "./ReferralInfo";
import { DisabledLabel } from "../common/Label";
import GPTModelDropDown from "../GPTModelDropDown";

const UserAPI = () => {
  const { close } = useAppState();
  const {
    showSources,
    updateAPIKey,
    api_key,
    updateHideSourceStatus,
    user,
    credits,
  } = useChatStore();
  // const [isValidAPIKey, setIsValidAPiKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkbox = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (checkbox?.current?.checked) {
      updateHideSourceStatus(true);
      console.log("on");
    } else {
      updateHideSourceStatus(false);
      console.log("off");
    }
  };
  const isAPIKeyValid = async (code: string) => {
    try {
      const res = await axios.post(BE_URL + "/api-key/check", { apiKey: code });
      if (res?.data?.success) {
        updateAPIKey(code);
        toast.success("API Key registered!");
      } else {
        toast.error("Invalid API Key!");
      }
    } catch (err) {
      console.log("err ", err);
      toast.error("Invalid API Key!");
    } finally {
      close("referralInfoModal");
    }
  };
  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef?.current!.value.length > 0) {
      let code = inputRef?.current?.value as string;
      const regex = /^sk-[A-Za-z0-9+/]{48}$/;
      const isValidAPI = regex.test(code);
      if (isValidAPI) {
        isAPIKeyValid(code);
      } else {
        toast.error("Invalid API Key!");
        close("referralInfoModal");
      }
    } else {
      inputRef?.current?.focus();
    }
  };
  const revokeAPIKey = () => {
    updateAPIKey("");
    toast.success("API Key Revoked!");
    close("referralInfoModal");
  };
  useEffect(() => {
    if (api_key.length === 51 && inputRef.current) {
      inputRef.current.value = api_key;
    }
  }, [api_key, inputRef.current]);
  return (
    <APIWrapper>
      <Column style={{ gap: "1.5rem" }}>
        <GPTModelDropDown />
        <APIForm onSubmit={onFormSubmit}>
          {!api_key ? (
            <span style={{ width: "100%", textAlign: "left" }}>
              Bring your own key
            </span>
          ) : (
            <span style={{ width: "100%", textAlign: "left" }}>
              Update your Open AI API key
            </span>
          )}
          <InputWrapper>
            <Input
              placeholder={
                api_key
                  ? "Update  your Open AI API key"
                  : "Enter your Open AI API key"
              }
              type={
                api_key && inputRef?.current?.value?.length === 51
                  ? "password"
                  : "text"
              }
              required
              ref={inputRef}
            />{" "}
            <SubmitBtn>
              {api_key ? (
                // green color
                <span>Update</span>
              ) : (
                <span>Save</span>
              )}
            </SubmitBtn>{" "}
          </InputWrapper>{" "}
          <DisabledLabel>
            <span>
              Add your Open AI API Key to get unlimited credits.{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                Get your key here
              </a>
            </span>
          </DisabledLabel>
        </APIForm>{" "}
        {api_key ? (
          <ModalBtn
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              padding: ".25rem",
            }}
            onClick={revokeAPIKey}
          >
            <Key size={15} />
            <span>Revoke API Key</span>
          </ModalBtn>
        ) : null}
      </Column>
      <Column style={{ gap: ".35rem" }}>
        <Row style={{ justifyContent: "space-between" }}>
          <span>Sources and Suggestions</span>
          <Swtich>
            <input
              type="checkbox"
              ref={checkbox}
              onClick={handleClick}
              checked={showSources}
              readOnly
            />
            <span className="slider"></span>
          </Swtich>
        </Row>
        <DisabledLabel>
          Disable/Enable sources and similar questions for every prompt.
        </DisabledLabel>{" "}
      </Column>
    </APIWrapper>
  );
};
const SubmitBtn = styled.button`
  background: ${(props) => props.theme.btnPrimary};
  color: #fff;
  border: none;
  outline: none;
  user-select: none;
  width: fit-content;
  font-size: 0.9rem;
  padding: 0.55rem;
  border-radius: 0.5rem;
  span {
    width: 100%;
  }
`;

const APIForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`;
const InputWrapper = styled(Row)`
  border-radius: 0.5rem;
  overflow: hidden;
  gap:.5rem;
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #535353;
    border-radius: 0.5rem;
    background: transparent;
    color: ${({ theme }) => theme.primary};
  }
`;
const Swtich = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    border-radius: 2rem;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #636363;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    &:before {
      position: absolute;
      content: "";
      height: 15px;
      width: 15px;
      left: 5px;
      bottom: 2.5px;
      border-radius: 2rem;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
  }
  input:checked + .slider {
    background-color: ${(props) => props.theme.btnPrimary};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${(props) => props.theme.btnPrimary};
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(17px);
    -ms-transform: translateX(17px);
    transform: translateX(17px);
  }
`;
const APIWrapper = styled(motion.div)`
  display: grid;
  place-items: center;
  gap: 1.5rem;
  text-align: center;
  width: 100%;
`;
export default UserAPI;
