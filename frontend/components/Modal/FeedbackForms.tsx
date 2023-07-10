import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import styled from "styled-components";
import Modal from ".";
import { useAppState } from "@/context/app.context";
import { TEXT } from "@/theme/texts";
import Button from "../common/Button";

const FeedbackFormLinks = () => {
  const { close, open } = useAppState();

  return (
    <Backdrop onClick={() => close("feedbackForms")}>
      <Modal close={() => close("feedbackForms")}>
        <FeedbackFormLinksWrapper>
          <TEXT.Body size="var(--fs-m)">
            We{"'"}d love to hear your feedback!
          </TEXT.Body>
          <TEXT.Disabled size="var(--fs-s)">
            We{"'"}re thrilled that you{"'"}ve been using us in your Web3
            journey! We{"'"}d love to know how we can improve to help you
            further, share your feedback and get 5 credits along the way!
          </TEXT.Disabled>
          <Button
            style={{ width: "100%" }}
            onClick={() => window.open("https://tally.so/r/mRdobj", "_blank")}
          >
            Tell us everything {"(+10pts)"}
          </Button>
          <Button
            style={{ width: "100%" }}
            onClick={() => window.open("https://tally.so/r/nPD9be", "_blank")}
          >
            Keep it quick {"(+5pts)"}
          </Button>
        </FeedbackFormLinksWrapper>
      </Modal>
    </Backdrop>
  );
};
const FeedbackFormLinksWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 30vh;
  ._title {
    font-size: clamp(1rem, 2vw, 1.15rem);
    font-family: var(--ff-light);
    color: #cfcfcf;
  }
`;
export default FeedbackFormLinks;
