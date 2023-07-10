import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

const CRMCircleBG = ({
  variant,
  hideInitial,
}: {
  variant: any;
  hideInitial?: boolean;
}) => {
  return (
    <CRMWrapperBG
      variants={variant}
      initial={hideInitial ? "" : "initial"}
      animate="animate"
    />
  );
};

const CRMWrapperBG = styled(motion.div)`
  --max-circle-diameter: 850px;
  position: fixed;
  bottom: -150px;
  left: 0;
  right: 0;
  margin: auto;
  background: #070707;
  box-shadow: 0px 0px 100px #1b2393, inset 0px 0px 50px rgba(122, 138, 255, 0.8);
  border-radius: 50%;
  height: 0px;
  width: 100%;
  max-width: var(--max-circle-diameter);
  display: block;
  padding: min(calc(var(--max-circle-diameter) / 2), 50%);
  line-height: 0;
  z-index: -1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom:0;
    top:12.5%;
    left:-25%;
    right:-25%;
  padding: min(calc(var(--max-circle-diameter) / 2), 65%);
  `}
`;

export default CRMCircleBG;
