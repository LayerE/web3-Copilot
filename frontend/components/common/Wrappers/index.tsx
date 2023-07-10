import styled from "styled-components";
import Column from "../Column";
import { motion } from "framer-motion";
const Wrapper = styled.div`
  width: 100%;
  ${({ theme }) => theme.flexRowNoWrap}
  flex-wrap: initial;
  justify-content: center;
`;

export const HeaderWrapper = styled(Wrapper)`
  background: transparent;
  z-index: 10;
`;

export const PageWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  z-index: 1;
`;

export const BodyWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex:1;
  position: relative;
  z-index: 1;
  border: 1px solid green;
`;
