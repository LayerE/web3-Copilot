import Conversation from "@/components/Conversation";
import SkeletonLoader from "@/components/SkeletonLoader";
import Button from "@/components/common/Button";
import Column from "@/components/common/Column";
import assets from "@/public/assets";
import { BE_URL } from "@/store";
import {
  copyToClipboard,
  truncatedAddress,
  useMobileScreen,
} from "@/utils/common";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, PlayCircle, Share2, User } from "react-feather";
import styled from "styled-components";

const Conversations = () => {
  const { query } = useRouter();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const isMobView = useMobileScreen();
  const [convos, setConvos] = useState([]);
  const fetchConvo = async (convoID: string) => {
    try {
      const res = await axios.post(BE_URL + "/conversation/id", {
        conversationId: convoID,
      });
      const combinedRes = res?.data?.conversation?.chats?.questions?.map(
        (item: any, index: number) => ({
          ques: item,
          ans: res?.data?.conversation?.chats?.answers[index],
        })
      );
      console.log("combinedREes", combinedRes);
      setConvos(combinedRes);
      setUser(res?.data?.conversation?.wallet);
    } catch (err) {
      console.log("err fetch convo", err);
    }
  };

  useEffect(() => {
    if (query["chat_id"]) fetchConvo(String(query["chat_id"]));
  }, [query, convos?.length]);

  return (
    <ConversationWrapper>
      {/* <Head>
        <title>{query["title"]}</title>
        <meta
          name="description"
          content="Your Copilot to Web3 Making chains conversational with AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="https://web3copilot.layer-e.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Polygon Copilot" />
        <meta
          property="og:description"
          content="Your Copilot to Web3 Making chains conversational with AI"
        />
        <meta
          property="og:image"
          content={`http://localhost:3000/api/og?title=${query["title"]}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Title>
        {user && (
          <Label>
            <User size={15} />
            <span>{`by ${truncatedAddress(user)}`}</span>
          </Label>
        )}
        <ShareBtn
          style={{ marginLeft: "auto" }}
          onClick={() =>
            copyToClipboard(
              `${window.location.origin}/chats?chat_id=${query["chat_id"]}`,
              "Session link copied!"
            )
          }
        >
          <Image src={assets.icons.icon_share} alt="" width={13} />
          {!isMobView && (
            <span style={{ cursor: "pointer", fontSize: ".8rem" }}>
              Share conversation
            </span>
          )}
        </ShareBtn>
        <ShareBtn onClick={() => router.push("/")}>
          {!isMobView && <span>Polygon Copilot</span>}
          <ArrowUpRight size={15} />
        </ShareBtn>{" "}
      </Title>
      {convos?.length > 0 ? (
        convos?.map((prompt, idx) => <Conversation prompt={prompt} key={idx} />)
      ) : (
        <Column
          style={{ maxWidth: "800px", gap: "1rem", margin: "0 auto" }}
          id="chat-page"
        >
          <SkeletonLoader />
        </Column>
      )}
      <ContinueBtn onClick={() => router.push(`/?chatID=${query["chat_id"]}`)}>
        <PlayCircle size={15} />
        <span>Continue this session</span>
      </ContinueBtn>
    </ConversationWrapper>
  );
};

const Label = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: #67666e;
  font-family: var(--ff-light);
  font-size: 0.9rem;
`;
const Title = styled.p`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.stroke};
`;
const ConversationWrapper = styled(Column)`
  gap: 1rem;
  position: relative;
  flex: 1;
`;
export const ShareBtn = styled(Button)`
  padding: 0;
  background: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: 1px solid ${(props) => props.theme.blue100};
`;
const ContinueBtn = styled(ShareBtn)`
  background: linear-gradient(0deg, #121212, #121212), #160c27;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 24px rgba(92, 45, 167, 0.45), 0px 3px 0px #000000;
  position: fixed;
  bottom: 1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
export default Conversations;
