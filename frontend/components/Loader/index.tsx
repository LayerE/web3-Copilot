import React from "react";
import styled, { keyframes } from "styled-components";

const Loader = () => {
  return (
    <LoaderWrapper>
      <div className="glow blue"></div>
      <div className="glow red"></div>
      <div className="glow green"></div>
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5px;
  display: flex;
  .glow {
    width: calc(100% / 3);
    height: 4px;
  }
  .blue {
    background: #5a2ea8;
    border-top-left-radius: 5px;
    box-shadow: 0px 0px 50px 15px #5a2ea8;
    animation: bar 3s infinite;
    animation-delay: 0s;
  }
  .red {
    background: #9659ff;
    box-shadow: 0px 0px 40px 10px #9659ff;
    animation: bar 3s infinite linear;
    animation-delay: 1s;
  }

  .green {
    background: #ca82f8;
    border-top-right-radius: 5px;
    box-shadow: 0px 0px 50px 15px #ca82f8;
    animation: bar 3s infinite linear;
    animation-delay: 0.4s;
  }
  @keyframes bar {
    0% {  
      width: calc(100% / 3);
    }
    50% {
      width: 50%;
    }
    100% {
      width: calc(100% / 3);
    }
  }
`;

export default Loader;
