import { motion } from "framer-motion";
import { ReactNode } from "react";
import styled from "styled-components";

const Backdrop = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <BackdropWrapper
      onClick={onClick}
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </BackdropWrapper>
  );
};
const BackdropWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* From https://css.glass */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 999;
  display: grid;
  place-items: center;
`;

export default Backdrop;
