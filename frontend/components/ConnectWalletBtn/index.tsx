import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import { useChatStore } from "@/store";
import Tippy from "@tippyjs/react";
import { useWeb3Modal } from "@web3modal/react";
import Image from "next/image";
import styled from "styled-components";
import { BtnImgWrapper } from "../Sidebar";
import { useAccount } from "wagmi";
import { useIPADScreen } from "@/utils/common";

const StyledButton = styled.button<{ bg?: string }>`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;

  border: 0;
  color: #ffffff;
  background: ${(props) => props.bg ?? "transparent"};
  font-size: 0.9rem;
  font-family: var(--ff-subtitle);
  border-radius: 0.25rem;
  transition: 200ms ease;
  width: fit-content;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.8;
  }
`;

export const ConnectWalletButton = ({ bg }: { bg?: string }) => {
  const { hasSiteAccess } = useChatStore();
  const { open } = useAppState();
  const { open: openModal } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const isIPAD = useIPADScreen();

  return isConnected || hasSiteAccess ? (
    isIPAD ? (
      <StyledButton onClick={() => openModal()} bg={bg} id="connect-wallet">
        <Image src={assets.icons.icon_wallet} alt={""} width={15} />

        {isConnected
          ? address?.slice(0, 6) + "..." + address?.slice(-4)
          : "Connect Wallet"}
      </StyledButton>
    ) : (
      <Tippy
        content="Connect wallet to get access to the product"
        placement="right"
      >
        <StyledButton onClick={() => openModal()} bg={bg} id="connect-wallet">
          <Image src={assets.icons.icon_wallet} alt={""} width={15} />

          {isConnected
            ? address?.slice(0, 6) + "..." + address?.slice(-4)
            : "Connect Wallet"}
        </StyledButton>
      </Tippy>
    )
  ) : isIPAD ? (
    <StyledButton onClick={() => open("siteAccessForm")} bg={bg}>
      <Image src={assets.icons.icon_wallet} alt={""} width={15} />
      Connect Wallet
    </StyledButton>
  ) : (
    <Tippy
      content="Connect wallet to get access to the product"
      placement="right"
    >
      <StyledButton onClick={() => open("siteAccessForm")} bg={bg}>
        <Image src={assets.icons.icon_wallet} alt={""} width={15} />
        Connect Wallet
      </StyledButton>
    </Tippy>
  );
};

//Note to fellow dev: Tippy prevents connect wallet button actions on mobile devices especially on android device, hence removing from mobile/ipad UIs!
