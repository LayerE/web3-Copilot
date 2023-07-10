import { BE_URL, useChatStore } from "@/store";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { TEXT } from "@/theme/texts";
import Button from "../common/Button";
import Row from "../common/Row";
import Image from "next/image";
import {
  ArrowUpRight,
  AtSign,
  CheckCircle,
  Circle,
  LogOut,
  MinusCircle,
  Trash,
  Trash2,
} from "react-feather";
import { DisabledLabel } from "../common/Label";
import { ReferralCode } from "./ReferralInfo";
import { trimAddress } from "@/utils/common";
import ICONS from "@/public/assets/icons/social-icons";
import axios from "axios";
import { toast } from "react-hot-toast";
import Tippy from "@tippyjs/react";
import { useAccount, useDisconnect } from "wagmi";
import { useAppState } from "@/context/app.context";

const ConnectSocials = () => {
  const {
    user,
    credits,
    jwt,
    updateJWT,
    updateLoginStatus,
    updateCreditCount,
    updateAPIKey,
    clearSessions,
  } = useChatStore();
  const { close } = useAppState();
  const { disconnect } = useDisconnect();
  const [disconnected, setDisconnected] = useState<any>({
    twitter: true,
    discord: true,
  });
  const login = (org: "twitter" | "discord") => {
    // window.history.replaceState(null, "", "/results");
    window.location.replace(
      `${BE_URL}/${org}/login?wallet=${user.wallet}&redirect_uri=${
        window.location.href + `?show_${org}_task=true`
      }`
    );
  };
  const disconnectAccount = async (org: "twitter" | "discord") => {
    try {
      const res = await axios.post(
        `${BE_URL}/disconnect`,
        { social: org },
        { headers: { authorization: jwt } }
      );
      if (res.status === 200) {
        toast.success("Account Disconnected!");
        setDisconnected((prev: any) => ({ ...prev, [org]: true }));
      } else {
        toast.error("Something went wrong!");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user?.isTwitterConnected) {
      setDisconnected((prev: any) => ({ ...prev, twitter: false }));
    }
    if (user?.isDiscordConnected) {
      setDisconnected((prev: any) => ({ ...prev, discord: false }));
    }
  }, []);
  return (
    <ConnectSocialsWrapper>
      {" "}
      <Column style={{ gap: ".5rem" }}>
        {" "}
        <UserData>
          <Image
            alt=""
            src={`https://api.dicebear.com/6.x/identicon/svg?seed=${user.wallet}`}
            width={35}
            height={35}
          />
          <Column>
            <p>{trimAddress(user?.wallet)}</p>
            <p style={{ fontSize: ".8rem", color: "#8342F2" }}>
              Credits: {credits}
            </p>{" "}
          </Column>
        </UserData>
        <Row gap=".5rem">
          <DisconnectWallet
            onClick={() => {
              clearSessions();
              close("showAppSettings");
            }}
          >
            <MinusCircle size={12} />
            <span>Clear all Chats</span>
          </DisconnectWallet>
          <DisconnectWallet
            onClick={() => {
              disconnect();
              updateJWT("");
              updateLoginStatus(false);
              updateCreditCount(0);
              updateAPIKey("");
              close("showAppSettings");
            }}
          >
            <LogOut size={12} />
            <span>Disconnect</span>
          </DisconnectWallet>
        </Row>
      </Column>
      <Column style={{ gap: ".5rem" }}>
        <p>Connect your socials and earn 10 credits</p>
        <ConnectSocial>
          {disconnected?.discord ? (
            <Button
              style={{
                background: "none",
                color: "#8342F2",
                padding: "0",
                gap: ".15rem",
              }}
              onClick={() => login("discord")}
            >
              <ICONS.DiscordIcon color="#8342F2" />
              <span>Connect Discord</span>
            </Button>
          ) : (
            <Row gap=".5rem">
              <Button
                style={{
                  background: "none",
                  color: "#4BB543",
                  padding: "0",
                  gap: ".15rem",
                }}
              >
                <ICONS.DiscordIcon color="#4BB543" />
                <span>{user?.discordID ?? "Discord Connected"}</span>
              </Button>
              <Tippy content="Disconnect" placement="right">
                <Button
                  onClick={() => disconnectAccount("discord")}
                  style={{ padding: 0, background: "none" }}
                >
                  <LogOut size={15} color="#ffffff" />{" "}
                </Button>
              </Tippy>
            </Row>
          )}
        </ConnectSocial>
      </Column>
      <Column style={{ gap: ".5rem" }}>
        <p>Polygon Copilot Policies</p>
        <TermLinks>
          <a
            href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/terms-of-use"
            target="_blank"
          >
            <span>Terms of Service</span> <ArrowUpRight size={13} />
          </a>
          <a
            href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/cookie-policy"
            target="_blank"
          >
            <span>Cookie Policy</span> <ArrowUpRight size={13} />
          </a>
          <a
            href="https://layer-e.gitbook.io/polygon-copilot-docs/polygon-copilot-policies/privacy-policy"
            target="_blank"
          >
            <span>Privacy Policy</span>
            <ArrowUpRight size={13} />
          </a>
        </TermLinks>
      </Column>
      <a
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "fit-content",
        }}
        href="https://polygon-copilot.canny.io/feature-requests"
        target="_blank"
      >
        <span>Request a Feature</span>
        <ArrowUpRight size={13} />
      </a>
    </ConnectSocialsWrapper>
  );
};

const DisconnectWallet = styled(Button)`
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
  background: none;
  color: #fff;
  text-decoration: none;
  border: 1px solid #8342f2;
  background: rgba(131, 66, 242, 0.2);
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
  ._dot {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    background: #f8ff34;
    box-shadow: 0px 0px 10px 1px #f8ff34;
    transition: all 0.3s;
  }
`;
const TermLinks = styled(Row)`
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.7rem;
  a {
    color: #fff;
    display: block;
    text-decoration: none;
    border: 1px solid #8342f2;
    background: rgba(131, 66, 242, 0.2);
    padding: 2px 0.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
  }
`;
const UserData = styled(Row)`
  gap: 0.75rem;
`;
const SocialIcon = styled(Button)`
  background: none;
  border: 0;
  gap: ".35rem";
  font-size: 0.7rem;
  width: fit-content;
  padding: 0rem;
  background: rgba(128, 127, 139, 0.1);
  border: 1px solid rgba(128, 127, 139, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  color: #807f8b;
`;
const ConnectSocialsWrapper = styled(Column)`
  gap: 1.25rem;
`;
const ConnectSocial = styled(Column)`
  gap: 0.25rem;
  font-size: 1rem;
`;
export default ConnectSocials;
