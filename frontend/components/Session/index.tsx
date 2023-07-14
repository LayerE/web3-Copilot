import React from "react";
import { Share, Star, Trash2 } from "react-feather";
import styled from "styled-components";
import Row from "../common/Row";
import { useChatStore } from "@/store/app";
import Image from "next/image";
import assets from "@/public/assets";
import useIsMobView from "@/hooks/useIsMobView";
import { useAppState } from "@/context/app.context";
import Button from "../common/Button";

type SessionProps = {
  closeMenu: () => void;
  deleteSession: () => void;
  selectSession: () => void;
  session: any;
  isActive: boolean;
};
const Session = ({
  deleteSession,
  selectSession,
  closeMenu,
  isActive,
  session,
}: SessionProps) => {
  const isMobView = useIsMobView();
  const { close, open, setlink } = useAppState();
  const { likeSession } = useChatStore();
  return (
    <SessionWrapper
      isactive={isMobView}
      style={isActive ? { background: "rgba(255, 255, 255, 0.10);" } : {}}
      onClick={() => {
        selectSession();
        closeMenu();
      }}
    >
      <Row gap=".5rem">
        <Image src={assets.icons.icon_chat} alt="" width={18} />
        <p>{session?.topic}</p>
        {session?.isFvrt && (
          <Image src={assets.icons.icon_star} alt="star" width={18} />
        )}
      </Row>

      <div className="_session_footer">
        <Button
          style={{ background: "none", padding: "0" }}
          onClick={() => likeSession(session?.id, !session?.isFvrt ?? true)}
        >
          {!session?.isFvrt ? (
            <Star size=".9rem" />
          ) : (
            <Image src={assets.icons.icon_star} alt="star" width={18} />
          )}
        </Button>
        {session?.conversation_id && (
          <Share
            size=".9rem"
            onClick={() => {
              setlink(
                encodeURI(
                  `${window.location.origin}/chats?chat_id=${session?.conversation_id}&title=${session?.title}`
                )
              );
              open("shareSessionModal");
              closeMenu();
            }}
            className="_deleteIcon"
          />
        )}

        <Trash2
          size=".9rem"
          onClick={(e) => {
            e.stopPropagation();
            deleteSession();
            closeMenu();
          }}
          className="_deleteIcon"
        />
      </div>
    </SessionWrapper>
  );
};

const PersonaTab = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.secondary};
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  font-family: var(--ff-light);
`;
const SessionWrapper = styled(Row)<{ isactive?: boolean }>`
  border-radius: 12px;
  gap: 0.5rem;
  height: 40px;
  align-items: center;
  width: 95%;
  border: none;
  margin: 0 auto;
  border-radius: 0.25rem;
  justify-content: space-between;
  transition: 0.2s ease;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.35rem 0.5rem;
  min-height: 2rem;
  text-transform: capitalize;
  font-family: var(--ff-light);
  position: relative;
  overflow: hidden;
  ._session_footer {
    display: ${(props) => (props?.isactive ? "flex" : "none")};
    gap: 0.5rem;
    position: absolute;
    right: 0;
    width: fit-content;
    justify-content: flex-end;
    align-items: center;
    padding: 0 0.5rem;
    height: 100%;
  }
  ._deleteIcon {
    transform: scale(1.025);
    opacity: 0.7;
    cursor: pointer;
  }
  &:hover {
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.05);
    ._session_footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #1b1b1b;
    }
  }
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    width: 100%;
    max-width: 80%;
  }
`;
export default Session;
