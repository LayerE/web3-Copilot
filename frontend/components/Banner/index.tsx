import assets from "@/public/assets";
import Image from "next/image";
import React from "react";
import { ArrowUpRight, X } from "react-feather";
import styled from "styled-components";
import Button from "../common/Button";
import Row from "../common/Row";
import { useAppState } from "@/context/app.context";

const Banner = () => {
  const { close } = useAppState();
  return (
    <BannerWrapper>
      <Row gap="0" style={{ margin: "0 auto", justifyContent: "center" }}>
        <Image
          src={assets.icons.icon_discord}
          alt=""
          width={20}
          style={{ borderRadius: "100%", marginRight: ".5rem" }}
        />
        <span>
          Be a part of the exclusive Copilot community.{" "}
          <a
            href="https://discord.gg/BHuBfJ2tbn"
            onClick={() => {
              close("banner");
              window.localStorage.setItem("banner_clicked", "true");
            }}
            target="_blank"
          >
            Join here
          </a>
        </span>

        <ArrowUpRight size={20} />
      </Row>
      <Button
        style={{ background: "none", padding: 0 }}
        onClick={() => {
          close("banner");
          window.localStorage.setItem("banner_clicked", "true");
        }}
      >
        <X size={20} />
      </Button>
    </BannerWrapper>
  );
};

const BannerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  margin: 0 auto;
  right: 0;
  width: 100%;
  border-radius: 0 0 0.25rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 1rem;
  background: ${(props) => props.theme.btnActive};
  z-index: 1001;
`;
export default Banner;
