import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Column from "../common/Column";
import { useSIWE } from "connectkit";

const SkeletonLoader = () => {
  const [loadersDimensions, setLoadersDimensions] = useState({
    a: 2,
    b: 1,
    c: 0.8,
    d: 0.5,
  });
  useEffect(() => {
    let initializeSkeletonDimensions = window.setTimeout(() => {
      setLoadersDimensions({ a: 100, b: 90, c: 80, d: 50 });
    }, 100);
    return () => {
      window.clearTimeout(initializeSkeletonDimensions);
    };
  }, [
    loadersDimensions.a,
    loadersDimensions.b,
    loadersDimensions.c,
    loadersDimensions.d,
  ]);
  return (
    <Column
      style={{
        gap: "1rem",
        background: "#212121",
        padding: "1rem",
        borderRadius: ".5rem",
      }}
    >
      <SkeletonLoaderObj
        width={`${loadersDimensions.a}%`}
        style={
          loadersDimensions?.a
            ? {
                animation: "shine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }
            : {}
        }
      />
      <SkeletonLoaderObj
        width={`${loadersDimensions.b}%`}
        style={
          loadersDimensions?.b
            ? {
                animation: "shine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }
            : {}
        }
      />
      <SkeletonLoaderObj
        width={`${loadersDimensions.c}%`}
        style={
          loadersDimensions?.c
            ? {
                animation: "shine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }
            : {}
        }
      />
      <SkeletonLoaderObj
        width={`${loadersDimensions.d}%`}
        style={
          loadersDimensions?.d
            ? {
                animation: "shine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }
            : {}
        }
      />
    </Column>
  );
};

const SkeletonLoaderObj = styled.div<{ width?: string; delay?: string }>`
  height: 7px;
  display: block;
  width: ${(props) => props?.width ?? 0};
  border-radius: 1rem;
  background: #67666e;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  transition: all 1.5s;

  @keyframes shine {
    50% {
      opacity: 0.5;
    }
  }
`;
export default SkeletonLoader;
