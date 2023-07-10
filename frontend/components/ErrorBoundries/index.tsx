import React, { Component, ErrorInfo, ReactNode } from "react";
import Button from "../common/Button";
import styled from "styled-components";
import { TEXT } from "@/theme/texts";
import Image from "next/image";
import assets from "@/public/assets";
import { useAccount, useDisconnect } from "wagmi";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorCtr>
          <Image
            src={assets.cliparts.ca_pepeCry}
            width={100}
            style={{ borderRadius: "100%" }}
            alt="error_img"
          />
          <TEXT.LargeHeader>Something Went Wrong!</TEXT.LargeHeader>
          <Button
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Try Again!
          </Button>
        </ErrorCtr>
      );
    }

    return this.props.children;
  }
}
const ErrorCtr = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
export default ErrorBoundary;
