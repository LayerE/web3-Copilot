import React from "react";
import styled from "styled-components";
import Column from "../common/Column";
import SearchBar from "../SearchBar";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/variants";
import useIsMobView from "@/hooks/useIsMobView";

const CRMSearch = ({
  hideTitle,
  fullWidthSearchBar,
  ddDirection = "down",
}: {
  hideTitle?: boolean;
  fullWidthSearchBar?: boolean;
  ddDirection?: "down" | "up";
}) => {
  const isMobileView = useIsMobView();
  return (
    <CRMWrapper
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      fullwidthsearchbar={fullWidthSearchBar ? 1 : 0}
    >
      {!hideTitle ? (
        <motion.div variants={fadeIn("up")}>
          <AppTitle>
            <p style={{ fontFamily: "var(--ff-imp)" }}>Your Polygon Buddy</p>
          </AppTitle>
          <Subheader>Make chains conversational</Subheader>
        </motion.div>
      ) : null}
      <motion.div variants={fadeIn("up")}>
        <SearchBar ddDirection={ddDirection} />
      </motion.div>
      {!hideTitle ? (
        <Subheader
          style={{
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
          variants={fadeIn("up")}
        >
          <span>
            Tip: Click on {"'"}/learn{"'"} to discover all commands.
          </span>
        </Subheader>
      ) : null}
    </CRMWrapper>
  );
};

const Subheader = styled(motion.p)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
  color: ${({ theme }) => theme.secondary};
  font-size: var(--fs-m);
  font-family: var(--ff-imp-reg);
`;
const AppTitle = styled(Column)`
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  align-items: center;
  justify-content: center;

  text-shadow: 0px 0px 18px rgba(255, 255, 255, 0.5);
`;

const CRMWrapper = styled(motion.div)<{ fullwidthsearchbar?: number }>`
  --max-crm-ctr-diameter: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;
  text-align: center;
  gap: 1.5rem;
  max-width: ${(props) =>
    props.fullwidthsearchbar === 1 ? "100%" : "var(--max-crm-ctr-diameter)"};
  z-index: 10;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    transform:translateY(-20%);
    `}
`;
export default CRMSearch;
