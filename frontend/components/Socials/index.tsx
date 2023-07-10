import React from "react";
import styled from "styled-components";
import Row from "../common/Row";
import assets from "@/public/assets";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/variants";

const Socials = () => {
  return (
    <SocialsWrapper variants={fadeIn("up")} animate="animate" initial="initial">
      <a href="https://twitter.com/LayerEhq" target="_blank">
        <Image src={assets.icons.icon_twitter} alt="" width={25} />
      </a>
      <a href="https://www.instagram.com/layerehq/" target="_blank">
        <Image src={assets.icons.icon_instagram} alt="" width={25} />
      </a>
      <a href="https://discord.com/invite/ZCngbtb8ry" target="_blank">
        <Image src={assets.icons.icon_discord} alt="" width={25} />
      </a>
    </SocialsWrapper>
  );
};

const SocialsWrapper = styled(motion.div)`
  display: flex;
  position: absolute;
  bottom: 30px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 0 auto;
  gap: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
 bottom:min(25%,200px);
  `}
  a {
    transition: 0.2s;
    :hover {
      transform: scale(1.1);
    }
  }
`;
export default Socials;
