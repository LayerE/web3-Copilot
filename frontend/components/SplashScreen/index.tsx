import assets from "@/public/assets";
import React from "react";
import styled from "styled-components";

const SplashScreen = () => {
  return (
    <SplashScreenWrapper>
      <div className="google">
        <div className="glogo">
          <img src={assets.logos.logo_polygon_circle.src} alt="logo" />
        </div>
        <div className="gtext">
          <span style={{ fontFamily: "var(--ff-content)" }}>polygon</span>
          <span style={{ fontFamily: "var(--ff-light)" }}>Copilot</span>
        </div>
      </div>
    </SplashScreenWrapper>
  );
};
const SplashScreenWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: radial-gradient(
      115.08% 100% at 60.65% 0%,
      rgba(121, 22, 255, 0.2) 0%,
      rgba(13, 5, 28, 0) 89.58%
    ),
    #000000;
  color: ${({ theme }) => theme.primary};
  z-index: 10;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  justify-content: center;
  align-items: center;
  display: inline-flex;
  position: absolute;
  text-align: center;
  .google {
    animation: backsplash 1.6s forwards;
    animation-delay: 1.05s;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 12px;
  }
  .glogo {
    /*background: url(https://www.festisite.com/static/partylogo/img/logos/google.png);*/
    width: 60px;
    height: 60px;

    border-radius: 50%;
    display: grid;
    place-items: center;
    animation: loadlogo 1.5s forwards;

    img {
      width: 100%;
    }
  }
  .gtext {
    font-size: clamp(1.5rem, 4vw, 3rem);
    color: ${({ theme }) => theme.primary};
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    animation: loadtxt 1.4s forwards;
    animation-delay: 0.6s;
    padding-left: 10px;
    font-weight: 300;
  }
  @keyframes backsplash {
    0% {
      box-shadow: none;
    }
    50% {
      box-shadow: 0px 0px 50px 15px #5a2ea8;
    }
    75% {
      box-shadow: 0px 0px 50px 15px #5a2ea8;
    }
    100% {
      box-shadow: none;
    }
  }
  @keyframes loadlogo {
    0% {
      margin-right: -300px;
      transform: scale(1.7);
    }
    20% {
      transform: scale(1);
    }
    100% {
      margin-left: 0;
    }
  }
  @keyframes loadtxt {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
export default SplashScreen;
