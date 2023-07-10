import React from "react";
import styled, { keyframes } from "styled-components";
import Column from "../common/Column";
import Row from "../common/Row";

const ResourcesSkeletonLoader = () => {
  return (
    <Row style={{ gap: "1rem", marginTop: ".5rem" }}>
      <ResourcesSkeletonLoaderObj delay="0.01s" width="20%" />
      <ResourcesSkeletonLoaderObj delay="0.013s" width="30%" />
      <ResourcesSkeletonLoaderObj delay="0.015s" width="50%" />
    </Row>
  );
};

const ResourcesSkeletonLoaderObj = styled.div<{
  width?: string;
  delay?: string;
}>`
  width: ${(props) => props.width ?? "100%"};
  height: 7px;
  padding: 0.5rem;
  display: block;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    #67666e;
  border-radius: 2rem;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
  animation-delay: ${(props) => props.delay ?? ".35s"};

  @keyframes shine {
    to {
      background-position: 95% 0, /* move highlight to right */ 0 0;
    }
  }
`;
export default ResourcesSkeletonLoader;
