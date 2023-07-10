import { copyToClipboard } from "@/utils/common";
import React, { ReactNode, useRef, useState } from "react";
import { Check, Clipboard } from "react-feather";
import styled from "styled-components";

const Code = ({ children }: { children: ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const handleClick = () => {
    if (codeRef.current) {
      const code = codeRef.current.innerText;
      copyToClipboard(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <CodeWrapper className="relative">
      <BlockHeader>
        {copied ? (
          <button>
            <Check size=".8rem" />
            <span>Copied</span>
          </button>
        ) : (
          <button onClick={handleClick}>
            <Clipboard size=".8rem" />
            <span>Copy code</span>
          </button>
        )}
      </BlockHeader>
      <code ref={codeRef}>{children}</code>
    </CodeWrapper>
  );
};
const BlockHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #181818;
  padding: 0.25rem 0.5rem;
  button {
    font-size: 0.8rem;
    display: flex;
    background: none;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--ff-content);
    color: #fff;
    border: none;
    &:hover {
      opacity: 0.8;
    }
  }
`;
const CodeWrapper = styled.pre`
  position: relative;
  margin: .5rem 0;
  code {
    padding: .5rem;
  }
`;

export default Code;
