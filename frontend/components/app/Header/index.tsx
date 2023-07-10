import Column from "@/components/common/Column";
import { DisabledLabel } from "@/components/common/Label";
import Row from "@/components/common/Row";
import assets from "@/public/assets";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";

export const BrandLogo = ({
  width,
  hideBetaLogo = false,
}: {
  width?: string;
  hideBetaLogo?: boolean;
}) => {
  const router = useRouter();
  return (
    <Column
      style={
        width
          ? {
              width: width,
              gap: ".35rem",
              alignItems: "center",
            }
          : {
              width: "150px",
              gap: ".35rem",
              alignItems: "center",
            }
      }
    >
      {!hideBetaLogo ? (
        <PolygonBetaLogo>
          <Image
            src={assets.logos.logo_layerE}
            width={125}
            alt="polygon logo"
            onClick={() => router.push("/")}
          />
        </PolygonBetaLogo>
      ) : (
        <PolygonBetaLogo>
          <Image
            src={assets.logos.logo_layerE}
            width={135}
            alt="polygon logo"
            onClick={() => router.push("/")}
          />
        </PolygonBetaLogo>
      )}
    </Column>
  );
};
const PolygonBetaLogo = styled.div`
  position: relative;
  ._beta_txt {
    position: absolute;
    top: -8px;
    background: linear-gradient(180deg, #8a46ff 0%, #6e38cc 100%);
    padding: 0.1rem 0.3rem;
    border-radius: 2rem;
    right: -10px;
    font-size: 0.5rem;
  }
`;
const AppHeader = () => {
  const router = useRouter();
  return (
    <AppHeaderCtr>
      {/* <BrandLogo /> */}
      {/* <Button
        bg="rgba(0, 0, 0, 0.2);"
        onClick={() => {
          router.push("/");
          //@ts-ignore
          if (window?.gtag) {
            //@ts-ignore
            window?.gtag("event", "launch_app", {
              event_category: "launch_app",
              event_label: window.location.pathname,
            });
          }
        }}
        hoverColor="rgba(0, 0, 0, 0.5);"
      >
        <Image src={assets.icons.icon_rocket} alt="" width={20} />
        Launch App
      </Button> */}
      {/* <ConnectKitButton/> */}
    </AppHeaderCtr>
  );
};
//styles
const AppHeaderCtr = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${(props) => props.theme.ctrSizes.maxAppCtrWidth};
  padding: 0.5rem 1rem;
  position: relative;
`;
const AppTitle = styled.h2`
  font-size: 1.25rem;
  font-family: var(--ff-content);
  color: #eee7f9;
  position: relative;
  ._beta {
    position: absolute;
    top: 0;
    margin-left: 0.5rem;
    font-size: 0.5rem;
    font-family: var(--ff-light);
    border: 1px solid ${({ theme }) => theme.stroke};
    padding: 0.1rem 0.25rem;
    border-radius: 0.25rem;
    background: linear-gradient(180deg, #8a46ff 0%, #6e38cc 100%);
  }
`;

export default AppHeader;
