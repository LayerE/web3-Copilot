import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import styled from "styled-components";
import Button from "../common/Button";
import Modal from ".";
import { useAppState } from "@/context/app.context";
import Image from "next/image";
import assets from "@/public/assets";

const DislikePrompt = () => {
  const { close, open } = useAppState();

  return (
    <Backdrop onClick={() => close("dislikePostModal")}>
      <Modal close={() => close("dislikePostModal")}>
        <DislikePromptWrapper>
          <Image
            src={assets.icons.icon_discord}
            alt=""
            width={54}
            style={{ marginRight: "auto" }}
          />
          <p>
            If you{"'"}d like to contact the support team directly for more
            help, please join our server and raise a ticket. Our team will be
            with you shortly.
          </p>
          <Button
            style={{ width: "100%" }}
            onClick={() =>
              window.open("https://discord.com/invite/0xPolygon", "_blank")
            }
          >
            Join Polygon Discord
          </Button>
        </DislikePromptWrapper>
      </Modal>
    </Backdrop>
  );
};
const DislikePromptWrapper = styled(motion.div)`
  display: grid;
  place-items: center;
  gap: 1.5rem;
  color: #cfcfcf;
`;
export default DislikePrompt;
