import { useAppState } from "@/context/app.context";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TEXT } from "@/theme/texts";
import { BE_URL, useChatStore } from "@/store";
import Button from "../common/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import Row from "../common/Row";
import { CheckCircle, Copy } from "react-feather";
import Column from "../common/Column";
import Image from "next/image";
import assets from "@/public/assets";
import { copyToClipboard, creditsCalc } from "@/utils/common";
import { DisabledLabel } from "../common/Label";

type LoadingProps = {
  verifyingTwitter: boolean;
  verifyingDiscord: boolean;
};
const EarnCredits = () => {
  const { user, jwt, updateUserInfo, api_key, credits, currentSession } =
    useChatStore();
  const [loading, setLoading] = useState<LoadingProps>({
    verifyingDiscord: false,
    verifyingTwitter: false,
  });
  const { open, close } = useAppState();
  const [timeLeft, setTimeLeft] = React.useState(0);

  const resetLoadingState = (
    loaderID: "verifyingDiscord" | "verifyingTwitter"
  ) => {
    setLoading((prev) => ({ ...prev, [loaderID]: false }));
  };
  const setLoadingState = (
    loaderID: "verifyingDiscord" | "verifyingTwitter"
  ) => {
    setLoading((prev) => ({ ...prev, [loaderID]: true }));
  };
  const totalTasksCompleted = useMemo(() => {
    let count = 0;
    if (user?.isTwitterFollowed) count += 1;
    if (user?.isServerJoined) count += 1;
    if (user?.isFeedbackSubmitted) count += 1;
    return count;
  }, [user]);
  const openLink = (link: string) => {
    window.open(link, "_blank");
  };
  const verifyTask = async (taskID: number, refCode: any) => {
    setLoadingState(taskID === 1 ? "verifyingTwitter" : "verifyingDiscord");
    try {
      const res = await axios.post(
        `${BE_URL}/task/verify`,
        {
          taskID: taskID,
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
        toast.success(
          ` ${
            taskID === 1 || taskID === 5 ? "Twitter" : "Discord"
          } task completed successfully!`
        );
        updateUserInfo();
      } else {
        toast.error("Task failed, retry!");
      }
    } catch {
      toast.error("Task failed, retry!");
    } finally {
      resetLoadingState(taskID === 1 ? "verifyingTwitter" : "verifyingDiscord");
    }
  };

  useEffect(() => {
    if (user?.tokenRefreshTime) {
      // add 24 hours to the date
      let newTime = new Date(user?.tokenRefreshTime)?.getTime() + 86400000;
      let timeLeft = new Date(newTime).getTime() - new Date().getTime();
      setTimeLeft(timeLeft);
      const interval = setInterval(() => {
        timeLeft = new Date(newTime).getTime() - new Date().getTime();
        setTimeLeft(timeLeft);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [user?.tokenRefreshTime]);
  return (
    <EarnCreditsWrapper>
      <Column style={{ padding: "0 .5rem", gap: ".5rem" }}>
        <span>Your Credits</span>
        <Row
          gap="1rem"
          style={{
            background: "#0A090D",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: ".5rem",
            borderRadius: ".5rem",
          }}
        >
          <Row gap=".25rem" width="fit-content">
            <span style={{ fontSize: ".9rem" }}>
              Current Credits :{" "}
              {api_key ? (
                <span style={{ color: "#A976FF" }}>N{"/"}A</span>
              ) : (
                <span style={{ color: "#A976FF" }}>{credits}</span>
              )}
            </span>
          </Row>{" "}
          <Row gap=".25rem" width="fit-content">
            <span style={{ fontSize: ".9rem" }}>
              Credits Earned:{" "}
              <span style={{ color: "#A976FF" }}>
                {" "}
                {user?.totalTokensEarned}
              </span>
            </span>
          </Row>
        </Row>
        {credits < 40 && (
          <TEXT.Disabled size={".8rem"}>
            You will get {creditsCalc(credits)} credits in{" "}
            <span
              style={{
                background: "#5c2da7b1",
                padding: "1px .3rem",
                borderRadius: ".25rem",
                color: "#fff",
                fontSize: ".7rem",
              }}
            >
              {Math.floor(
                (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              )}{" "}
              h {Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))} m{" "}
              {Math.floor((timeLeft % (1000 * 60)) / 1000)} s
            </span>
          </TEXT.Disabled>
        )}
      </Column>

      <Tasks>
        <span>Earn Credits</span>
        <Task isCompleted={user?.isServerJoined ? 1 : 0}>
          <TaskImg>
            <Image src={assets.icons.icon_discord2} alt="" width={30} />
          </TaskImg>
          <TaskContent>
            <TaskTitle>
              Join Discord Server {"("}+10 credits{")"}
            </TaskTitle>
            <Row style={{ gap: ".75rem" }}>
              {!user?.isServerJoined ? (
                <TaskBtn
                  onClick={() => openLink("https://discord.gg/NyNkpTgf")}
                >
                  Join
                </TaskBtn>
              ) : (
                <TaskBtn>
                  <span style={{ color: "#4BB543" }}>Completed</span>
                  <CheckCircle color={"#4BB543"} size={15} />
                </TaskBtn>
              )}
              {!user?.isServerJoined ? (
                <TaskBtn
                  onClick={
                    user?.isDiscordConnected
                      ? () => verifyTask(2, user?.referralCode)
                      : () => toast.error("Connect your discord account!")
                  }
                >
                  {loading?.verifyingDiscord ? "Verifying..." : "Verify"}
                </TaskBtn>
              ) : null}
            </Row>
          </TaskContent>
        </Task>
        {/* <Task>
        <TaskImg>
          <Image src={assets.icons.icon_twitter} alt="" width={30} />
        </TaskImg>
        <TaskContent>
          <TaskTitle>
            Share Session on Twitter {"("}+5 credits{")"}
          </TaskTitle>
          <Row style={{ gap: ".5rem" }}>
            <TaskBtn
              onClick={() =>
                openLink(
                  `https://twitter.com/intent/tweet?text=${
                    window.location.href
                  }chats?chat_id=${
                    currentSession()?.conversation_id
                  }&title=${currentSession()?.topic?.replace(/ /g, "%20")}`
                )
              }
            >
              Share
            </TaskBtn>

            <TaskBtn
              onClick={
                user?.isTwitterConnected
                  ? () => verifyTask(5, user?.referralCode)
                  : () => toast.error("Connect your twitter account!")
              }
            >
              {loading?.verifyingTwitter ? "Verifying..." : "Verify"}
            </TaskBtn>
          </Row>
        </TaskContent>
      </Task> */}
        <Task
          isCompleted={user?.isFeedbackSubmitted ? 1 : 0}
          onClick={() => {
            window.open("https://tally.so/r/mRdobj", "_blank");
            //@ts-ignore
            if (window?.gtag) {
              //@ts-ignore
              window?.gtag("event", "feedback_form", {
                event_category: "feedback_form",
                event_label: "feedback_form",
              });
            }
          }}
        >
          <TaskImg>
            <Image src={assets.icons.icon_feedback} alt="" width={30} />
          </TaskImg>
          <TaskContent>
            <TaskTitle>Share Feedback {"(+10 credits)"}</TaskTitle>
            <Row style={{ gap: ".5rem" }}>
              {user?.isFeedbackSubmitted ? (
                <TaskBtn>
                  <span style={{ color: "#4BB543" }}>Completed</span>
                  <CheckCircle color={"#4BB543"} size={15} />
                </TaskBtn>
              ) : null}
            </Row>
          </TaskContent>
        </Task>
        <Task>
          <TaskImg>
            <Image src={assets.icons.icon_referral} alt="" width={30} />
          </TaskImg>
          <TaskContent>
            <TaskTitle>Refer friends {"(+10 credits)"}</TaskTitle>
            <TaskBtn
              onClick={() =>
                copyToClipboard(user?.referralCode, "Referral Code Copied!")
              }
            >
              <span>Share Code</span>
              <Copy size={".8rem"} color="#fff" />{" "}
            </TaskBtn>
            <DisabledLabel style={{ fontSize: ".7rem" }}>
              Successful Referrals: {user?.referredCount}
            </DisabledLabel>{" "}
          </TaskContent>
        </Task>
      </Tasks>

      {/* <FeedbackBtn
       
      >
        <Image src={assets.icons.icon_feedback} alt="" width="10" />
        <span>Share Feedback</span>
      </FeedbackBtn> */}
    </EarnCreditsWrapper>
  );
};

const FeedbackBtn = styled(Button)`
  font-size: 0.7rem;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.5rem;
  position: absolute;
  background: none;
  border: 1px solid ${(props) => props.theme.stroke};
  border-radius: 2rem;
  bottom: 0.5rem;
  left: 0.5rem;
`;
const Tasks = styled(Column)`
  max-height: 400px;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0.5rem;
`;
const Task = styled(Row)<{ isCompleted?: number }>`
  gap: 0.5rem;
  background: #19161d;
  border-radius: 8px;
  padding: 0.5rem;
  opacity: ${(props) => (props.isCompleted === 1 ? 0.5 : 1)};
  cursor: ${(props) => (props.isCompleted === 1 ? "not-allowed" : "pointer")};
`;
const TaskTitle = styled.p`
  font-family: var(--ff-light);
  font-size: 0.9rem;
`;
const TaskContent = styled(Column)`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.25rem 0.5rem;
`;
const TaskBtn = styled(Button)`
  background: none;
  padding: 0;
  font-size: 0.9rem;
  color: #8342f2;
  outline: none;
  user-select: none;
`;
const TaskImg = styled(Column)`
  width: 40px;
  height: 40px;
  padding: 0.5rem;
  background: rgba(169, 118, 255, 0.5);
  border: 1px solid #a976ff;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const CreditBtn = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--ff-light);
  border-radius: 0.5rem;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  padding: 0.35rem 0.5rem;
  width: 100%;
`;
const EarnCreditsWrapper = styled(Column)`
  gap: 0.5rem;
`;
export default EarnCredits;
