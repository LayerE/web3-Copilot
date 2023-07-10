import { motion } from "framer-motion";
import styled from "styled-components";

export const ImageWrapper = styled(motion.div)<{
  size?: string;
  radius?: string;
  hover?: boolean;
  coverFit?: "cover" | "contain";
}>`
  min-width: ${({ size }) => size ?? "20px"};
  width: ${({ size }) => size ?? "20px"};
  height: ${({ size }) => size ?? "20px"};
  border-radius: ${({ radius }) => radius ?? "6px"};
  display: grid;
  place-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: ${(props) => props?.coverFit ?? "cover"};
    object-position: center;
  }
  &:hover {
    scale: ${(props) => (props?.hover ? 1.1 : "initial")};
  }
`;
