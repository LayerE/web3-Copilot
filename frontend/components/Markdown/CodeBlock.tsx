import { copyToClipboard } from "@/utils/common";
import React, { useState } from "react";
import { Check, Clipboard, Terminal } from "react-feather";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styled from "styled-components";
import Button from "../common/Button";
import { getParameters } from 'codesandbox/lib/api/define';

interface Props {
  language: string;
  value: string;
  isDone?: boolean;
}



const OpenRemix = (code: string) => {
  //@ts-ignore
  if (window?.gtag) {
   //@ts-ignore
   window?.gtag("event", "open_in_remix", {
     event_category: "open_in_remix",
     event_name: "open_in_remix",
     event_label: "remix",
   });
 }
 const remix = new URL("https://remix.ethereum.org");
 remix.searchParams.set(
   "code",
   Buffer.from(code).toString("base64")?.replace(/=*$/, "")
 );
 return remix;
};

const openIDE = (code: string) => {
  //@ts-ignore
  if (window?.gtag) {
   //@ts-ignore
   window?.gtag("event", "open_in_ide", {
     event_category: "open_in_ide",
     event_name: "open_in_ide",
     event_label: "ide",
   });
 }
 const parameters = getParameters({
  files: {
    'index.js': {
      content: code,
      isBinary: false,
    },
  },
});
const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
return url;
}


const CodeBlock: React.FC<Props> = ({ language, value, isDone }) => {
  const [copied, setCopied] = useState(false);
  
  const handleClick = () => {
       //@ts-ignore
       if (window?.gtag) {
        //@ts-ignore
        window?.gtag("event", "copy_code", {
          event_category: "copy_code",
          event_name: "copy_code",
          event_label: "copy_code",
        });
      }
    copyToClipboard(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <CodeblockWrapper className="relative">
      <BlockHeader>
        <span>{language}</span>
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
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        wrapLongLines={true}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
 
 {isDone && 
      <>    
      <ContractDeployBtn onClick={() =>
                            language !== "solidity" ? window.open(openIDE(value), "_blank") :
                            window.open(OpenRemix(value), "_blank")
                          }
                        >
                          <Terminal size={15} />
                         {language !== "solidity" ? "Open in IDE" : "Open in Remix"}
                        </ContractDeployBtn>
                        </> }
                        
    </CodeblockWrapper>
  );
};
const ContractDeployBtn = styled(Button)`
font-size: 0.9rem;
padding: 0.25rem 0.5rem;
margin: 0rem 0.5rem;
`;

const BlockHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
const CodeblockWrapper = styled.div`
  position: relative; 
  div:nth-child(2) {
    margin: 0 !important;
    background: rgba(0, 0, 0, 0.5) !important;
  }
`;

export default CodeBlock;
