"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import { BE_URL, useChatStore } from "@/store";
import Script from "next/script";
import Header from "@/components/Header";
import { useAppState } from "@/context/app.context";
import { useAccount } from "wagmi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useIPADScreen } from "@/utils/common";
import Sidebar from "@/components/Sidebar";
import Signup from "@/components/Modal/Signup";
import Referral from "@/components/Modal/Referral";
import FeedbackFormLinks from "@/components/Modal/FeedbackForms";
import SiteAccessForm from "@/components/Modal/SiteAccessModal";
import EarlyBirdForm from "@/components/Modal/EarlyBirdForm";
import ShareSession from "@/components/Modal/ShareSession";
import AppSettings from "@/components/AppSettings";
import EarnCredits from "@/components/Modal/EarnCredits";
import AgentTaskPannel from "@/components/AgentTaskPannel";
import MobNav from "@/components/app/MobNav";
const LayoutFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-height:100%;
  padding-top: 4rem;
  `}
`;
const LayoutContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const storeLoaded = useHasHydrated();
  const { close, open, showModal } = useAppState();
  const { api_key, selectSession, sessions } = useChatStore();
  const { isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      callLogin(address);
      close("signUpModal");
    },
    onDisconnect() {
      updateJWT("");
      updateLoginStatus(false);
      updateCreditCount(0);
      updateAPIKey("");
      close("signUpModal");
    },
  });

  const {
    updateUserInfo,
    isLoggedIn,
    updateCreditCount,
    updateJWT,
    updateLoginStatus,
    credits,
    updateAPIKey,
    hasSiteAccess,
    creditStatus,
    currentSession,
  } = useChatStore();

  const [thumbnailTitle, setThumnailTitle] = useState("Layer-E Copilot");
  const { query } = useRouter();

  const callLogin = async (code: any) => {
    try {
      const res = await axios.post(`${BE_URL}/user/login`, {
        wallet: code,
        credits: credits ?? 0,
        secretCode: localStorage.getItem("code") ?? "false",
      });
      updateJWT(res.data.token);
      updateLoginStatus(true);
      toast.success("Logged in Successfully!");
      if (res.data.isNewUser) open("referralModal");
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.clear();
        toast.error("Code Limit Exceeded! Please try with another code");
      }
      updateJWT("");
      updateLoginStatus(false);
      console.log(err);
      toast.error("Logged in Failed!");
    }
  };
  useEffect(() => {
    if (!isLoggedIn && !creditStatus) {
      open("signUpModal");
    }
    if (isLoggedIn && !isConnected) {
      updateJWT("");
      updateLoginStatus(false);
      updateCreditCount(0);
      updateAPIKey("");
    }
  }, [
    isLoggedIn,
    creditStatus,
    currentSession()?.prompts?.length,
    isConnected,
  ]);
  useEffect(() => {
    updateUserInfo();
  }, [isLoggedIn]);
  useEffect(() => {
    if (query) {
      setThumnailTitle(query["title"] as string);
    }
  }, [thumbnailTitle, query]);

  return (
    <>
      <Head>
        <title>{thumbnailTitle ?? "Layer-E Copilot"}</title>
        <meta name="description" content="Your Personal Web3 AI Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* @dev - Update the meta tags with the new copy  */}
        {/* <meta property="og:url" content="https://copilot.polygon.technology" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Polygon Copilot" />
        <meta
          property="og:description"
          content="Your Personal Web3 AI Assistant"
        />
        <meta
          property="og:image"
          content={`https://polygon-copliot.vercel.app/opengraph.png`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="https://copilot.polygon.technology"
        />
        <meta
          property="twitter:url"
          content="https://copilot.polygon.technology"
        />
        <meta name="twitter:title" content="Polygon Copilot" />
        <meta
          name="twitter:description"
          content="Your Personal Web3 AI Assistant"
        />
        <meta
          name="twitter:image"
          content={`https://polygon-copliot.vercel.app/opengraph.png`}
        /> */}

        <link
          rel="icon"
          href="https://crew3-production.s3.eu-west-3.amazonaws.com/public/3208469a-f065-4b79-8271-fff44c902611-profile.png"
        />
      </Head>

      <AnimatePresence
        mode="wait"
        initial={router.pathname === "/" ? true : false}
      >
        {storeLoaded && (
          <LayoutFrame key={router.pathname}>
            <MobNav />
            {(router.pathname === "/agent" || router.pathname === "/") && (
              <Sidebar />
            )}
            <LayoutContentWrapper>
              <Header />
              {children}
            </LayoutContentWrapper>{" "}
            {router.pathname === "/agent" && <AgentTaskPannel />}
            {showModal.signUpModal && !isConnected ? <Signup /> : null}
            {showModal.earnCreditsModal &&
            isLoggedIn &&
            api_key.length === 0 ? (
              <EarnCredits />
            ) : null}{" "}
            {showModal.referralModal && isLoggedIn ? <Referral /> : null}
            {showModal.feedbackForms ? <FeedbackFormLinks /> : null}
            {showModal.siteAccessForm ? <SiteAccessForm /> : null}
            {showModal.earlyBirdForm ? <EarlyBirdForm /> : null}
            {showModal.shareSessionModal ? <ShareSession /> : null}{" "}
            {showModal.showAppSettings ? <AppSettings /> : null}
          </LayoutFrame>
        )}
      </AnimatePresence>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-T78HNJ0HM1"
      />
      <Script strategy="lazyOnload" id="G-T78HNJ0HM1">
        {`
            window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T78HNJ0HM1');
            `}
      </Script>
    </>
  );
}

export default Layout;
