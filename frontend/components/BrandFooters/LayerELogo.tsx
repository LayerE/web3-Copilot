import React from "react";
import Row from "../common/Row";
import Image from "next/image";
import assets from "@/public/assets";
import { DisabledLabel } from "../common/Label";
import styled from "styled-components";

const LayerELogo = () => {
  return (
    <LayerE
      gap=".25rem"
      onClick={() => window.open("https://twitter.com/LayerEhq", "_blank")}
    >
      <DisabledLabel style={{ fontSize: ".7rem", color: "#fff" }}>
        Built and maintained by Layer-E
      </DisabledLabel>
      <Image
        src={assets.logos.logo_layerE_circle}
        alt=""
        width={13}
        style={{ borderRadius: "2rem" }}
      />
    </LayerE>
  );
};

const LayerE = styled(Row)`
  justify-content: center;
  width: fit-content;
  padding: 0.1rem 0.2rem;
  gap: 0.25rem;
  padding-left: 0.5rem;
  border-radius: 1rem;
  background: none;
  cursor: pointer;
  border: 1px solid #2a2a2a;
  transition: 0.4s ease;
  &:hover {
    box-shadow: 0px 0px 20px 7px #5a2ea8;
  }
`;
export default LayerELogo;
