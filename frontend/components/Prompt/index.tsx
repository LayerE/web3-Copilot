import React, { memo, FC, useEffect, useState, ReactNode } from "react";
import styled from "styled-components";
import Column from "../common/Column";
import { BE_URL, Prompt, useChatStore } from "@/store";
import {
  AlertCircle,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Link,
  Search,
  Terminal,
  ThumbsDown,
  ThumbsUp,
} from "react-feather";
import Row from "../common/Row";
import assets from "@/public/assets";
import Image from "next/image";
import { TEXT } from "@/theme/texts";
import { useAppState } from "@/context/app.context";
import Button from "../common/Button";
import SkeletonLoader from "../SkeletonLoader";
import MarkdownContent from "../Markdown";
import axios from "axios";
import { toast } from "react-hot-toast";
import { copyToClipboard } from "@/utils/common";
import ResourcesSkeletonLoader from "../SkeletonLoader/ResourcesSkeleton";
import PersonaIcon from "../PersonaIcon";
import { useAccount, useWalletClient, useSwitchNetwork } from "wagmi";
import Web3 from "web3";
import MintForm from "../MintForm";
import BulkMintForm from "../MintForm/BulkMint";
import Loader from "../Loader";

const ReadMore = ({ text }: { text: string }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <ReadmoreTxtWrapper>
      {isReadMore ? text.slice(0, 150) : text}
      {text.length > 150 && (
        <span onClick={toggleReadMore} className="_read-or-hide">
          {isReadMore ? "...read more" : " show less"}
        </span>
      )}
    </ReadmoreTxtWrapper>
  );
};
const ReadmoreTxtWrapper = styled.p`
  ._read-or-hide {
    font-size: 0.9rem;
    padding-left: 0.5rem;
    cursor: pointer;
    text-decoration: underline;
  }
`;
const mintBodyIsComplete = (prompt: Prompt) => {
  return (
    prompt?.mintBody?.type?.length > 0 &&
    prompt?.mintBody?.name?.length > 0 &&
    prompt?.mintBody?.description?.length > 0
  );
};

const PolygonLogo = () => {
  return (
    <Image
      src={assets.logos.logo_layerE_circle}
      alt=""
      width={20}
      style={{ marginBottom: "auto" }}
    />
  );
};

function extractSiteName(url: any) {
  let domain = new URL(url);
  return domain.hostname;
}
const MemoPolygonLogo = React.memo(PolygonLogo);
const Prompt: FC<{
  prompt: Prompt;
  prompt_idx: number;
}> = ({ prompt, prompt_idx }) => {
  const [showSource, setShowSource] = useState<any>(false);
  const [contractStatus, setContractStatus] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState<any>(false);
  const { likePrompt, credits, updateCurrentSession, currentSession } =
    useChatStore();
  const [loading, setLoading] = useState(false);
  const { setExamplePrompt } = useAppState();
  const { address, isConnected, connector } = useAccount();
  const { data: signer } = useWalletClient();
  const { chains, switchNetworkAsync } = useSwitchNetwork();
  const [promptIDX, setPromptIDX] = useState(0);
  const [promptResponseTime, setPromptResponseTime] = useState(0);
  const setSgsPrompt = (sgs: string) => {
    if (credits > 0) setExamplePrompt(sgs, "/learn");
  };

  const prevPrompt = () => {
    if (promptIDX === 0) {
      setPromptIDX(0);
    } else {
      setPromptIDX((prev) => prev - 1);
    }
  };
  const nextPrompt = () => {
    if (promptIDX > prompt?.regeneratedResponses!?.length - 1) {
      setPromptIDX(prompt?.regeneratedResponses!?.length);
    } else {
      setPromptIDX((prev) => prev + 1);
    }
  };
  const updateDeploymentStatus = async (id: any, hash: string) => {
    try {
      const res = await axios.post(`${BE_URL}/analytics/deployment/status`, {
        id: id,
        hash: hash,
        chain: "pos",
        type: "contract",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const deployContract = async (code: any, id: any) => {
    setLoading(true);
    try {
      const res = await axios.post(BE_URL + "/compile", {
        source: code,
      });
      if (res.status === 200) {
        // deploy contract with bytecode
        if ((await connector?.getChainId()) !== 137) {
          await switchNetworkAsync?.(137);
        }
        const unspecifiedData: any = await signer;
        const provider = await connector?.getProvider();

        const web3 = new Web3(provider);

        const contract = new web3.eth.Contract(res.data.abi);
        const deploy = await contract
          .deploy({
            data: res.data.bytecode,
          })
          ?.encodeABI();
        console.log("deploy", deploy);
        const tx = {
          from: address,
          data: deploy,
        };
        const receipt = await web3.eth.sendTransaction(tx);
        if (receipt) {
          setLoading(false);
          toast.success("Contract Deployed!");
          await updateDeploymentStatus(id, receipt?.transactionHash);
          // get the contract address
          //@ts-ignore
          console.log("contract address", receipt?.contractAddress);
          // get the explorer link based on network
          //@ts-ignore
          let message = `Contract deployed successfully!,Contract Address: ${receipt?.contractAddress},tx hash: ${receipt?.transactionHash}  
          `;
          updateCurrentSession((session) => {
            session.lastUpdate = new Date().toLocaleString();
            session.prompts.map((_prompt) => {
              if (_prompt.id === prompt.id) {
                prompt.txData = message;
              }
              return _prompt;
            });
          });
        }
      } else {
        setLoading(false);
        toast.error("Error Deploying Contract!");
      }
    } catch (err) {
      setLoading(false);
      console.log("err", err);
      //@ts-ignore
      toast.error(err?.response?.data?.message);
    }
  };

  const onFeedbackSubmission = async (mssgID: any, isHelpFul: boolean) => {
    try {
      const res = await axios.post(`${BE_URL}/analytics/feedback`, {
        id: mssgID,
        feedback: "",
        isHelpful: isHelpFul.toString(),
      });
    } catch (err) {
      console.log(err);
      toast.error("Feedback not recorded!");
    }
  };
  useEffect(() => {
    let responseTimer: any;

    responseTimer = window.setInterval(() => {
      if (!prompt?.streaming) window.clearInterval(responseTimer);
      setPromptResponseTime((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(responseTimer);
    };
  }, [prompt?.streaming]);
  useEffect(() => {
    if (prompt?.regeneratedResponses!.length > 0) {
      setPromptIDX(prompt?.regeneratedResponses!.length);
    }
  }, [prompt?.regeneratedResponses!.length]);

  useEffect(() => {
    if (prompt?.sources?.length > 0) {
      setShowSource(true);
    }

    if (prompt?.suggestions?.length > 0) {
      setShowSuggestion(true);
    }
  }, [
    prompt?.suggestions?.length,
    prompt?.sources?.length,
    showSource,
    showSuggestion,
  ]);

  const isFetchError = (text: string) => {
    if (
      text === "Error fetching response or all credits used up." ||
      text ===
        "You have no credits left. Please Connect your wallet to get more credits." ||
      text === "All credits used up! Come back tomorrow for more credits." ||
      text === "Error fetching response"
    ) {
      return true;
    } else return false;
  };
  console.log("prompt links", prompt?.loader_links);
  console.log("prompt queries", prompt?.loader_queries);
  return (
    <PromptWrapper>
      <PromptTitle>
        <ReadMore text={prompt.title} />
        {prompt?.fullContentLoaded && (
          <span
            className="_copyPromptBtn"
            onClick={() => copyToClipboard(JSON.stringify(prompt?.content))}
            style={{ marginLeft: "auto" }}
          >
            Copy
            <Clipboard size={".9rem"} />
          </span>
        )}
      </PromptTitle>
      <PromptContentWrapper>
        <PromptContent>
          {prompt.streaming && !prompt.content ? (
            <Content>
              {currentSession()?.type === "validator" ? (
                <Content>
                  <Image
                    src={assets.cliparts.ca_loading_pepe}
                    alt=""
                    width={100}
                    style={{ borderRadius: "1rem" }}
                  />
                  <DegenLoaderLabel>
                    <Image src={assets.icons.icon_loader} alt="" width={20} />
                    <span>The degen me is thinking...</span>
                  </DegenLoaderLabel>
                </Content>
              ) : (
                <Content>
                  <Row style={{ justifyContent: "space-between" }}>
                    <Row gap="1rem" width="fit-content">
                      {promptResponseTime > 20 ? (
                        <Row style={{ gap: ".5rem" }}>
                          <span>
                            Oops, this is taking a bit longer than expected.
                            Looks like you{"'"}ll have to regenerate.
                          </span>
                          <Image
                            src={assets.icons.icon_turtle}
                            width={15}
                            alt=""
                          />
                        </Row>
                      ) : (
                        <Row style={{ gap: ".5rem", color: "#CBADFF" }}>
                          <Image
                            src={assets.icons.icon_brain}
                            width={15}
                            alt=""
                          />
                          <span>
                            Copilot is understanding your question . . .
                          </span>
                        </Row>
                      )}
                    </Row>
                  </Row>
                  {prompt?.type !== "learn" && <SkeletonLoader />}
                </Content>
              )}
              {prompt?.loader_links!?.length > 0 && (
                <Content>
                  <Row
                    style={{
                      gap: ".5rem",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    <Image src={assets.icons.icon_ai} alt="" width={17} />
                    <p>Copilot has found relevant results</p>
                  </Row>
                  <LoaderLinks>
                    {prompt?.loader_links?.map((v: any, i: number) => (
                      <LoaderLink key={i}>
                        <p>{v?.title}</p>
                        <a href={v?.link} target="_blank">
                          {v?.link?.slice(0, 40) + "..."}
                        </a>
                      </LoaderLink>
                    ))}
                  </LoaderLinks>
                </Content>
              )}
              {prompt?.loader_queries!?.length > 0 && (
                <Content>
                  <Row
                    style={{
                      gap: ".5rem",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    <Search size={15} />
                    <p>Copilot is is searching the web for answers</p>
                  </Row>
                  <LoaderQueries>
                    {prompt?.loader_queries?.map((v, i) => (
                      <LoaderQuery key={i}>{v}</LoaderQuery>
                    ))}{" "}
                  </LoaderQueries>{" "}
                </Content>
              )}
            </Content>
          ) : (
            <Content>
              {prompt.isAllCreditsUsed ? (
                "All credits are used, please sign up!"
              ) : (
                <Row
                  style={{
                    gap: "1rem",
                  }}
                >
                  <MainContent>
                    {isFetchError(prompt?.content as string) ? (
                      <div>
                        {currentSession()?.type === "validator" && (
                          <Image
                            src={assets.cliparts.ca_pepeCry}
                            alt=""
                            width={100}
                            style={{
                              borderRadius: "100%",
                              marginBottom: "1rem",
                            }}
                          />
                        )}
                        <ErrorLabel>
                          <Image
                            src={assets.icons.icon_alert}
                            alt="alert_icon"
                            width={15}
                          />
                          <span>
                            {currentSession()?.type === "validator"
                              ? "I have been rugged, regenerate me back please"
                              : "Oops…this is embarrassing. Looks like you’ll have to regenerate the response "}
                          </span>
                          <Image
                            src={assets.icons.icon_hands}
                            alt="alert_icon"
                            width={15}
                          />
                        </ErrorLabel>
                      </div>
                    ) : (
                      <MarkdownContent
                        content={
                          prompt?.regeneratedResponses![promptIDX] &&
                          prompt?.fullContentLoaded
                            ? prompt?.regeneratedResponses![promptIDX]
                            : prompt?.content!
                        }
                        isDone={
                          prompt.streaming && prompt.content ? true : false
                        }
                      />
                    )}
                    {prompt?.isMintReady && !prompt?.txData ? (
                      JSON?.parse(prompt?.sourceCode)?.bulk ? (
                        <BulkMintForm
                          formData={prompt?.sourceCode}
                          prompt={prompt}
                        />
                      ) : (
                        <MintForm
                          formData={prompt?.sourceCode}
                          prompt={prompt}
                        />
                      )
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {prompt?.isContractReady && !prompt?.txData ? (
                        <ContractDeployBtn
                          disabled={loading}
                          onClick={() =>
                            deployContract(prompt?.sourceCode, prompt?.mssgId)
                          }
                        >
                          {loading
                            ? "Deploying..."
                            : "Click to deploy contract"}
                        </ContractDeployBtn>
                      ) : null}
                    </div>
                    {prompt?.txData && (
                      <div style={{ marginTop: ".5rem" }}>
                        <p>{prompt?.txData?.split(",")[0]}</p>
                        <p>{prompt?.txData?.split(",")[1]}</p>
                        <p>{prompt?.txData?.split(",")[2]}</p>
                      </div>
                    )}
                  </MainContent>
                  {prompt?.mssgId && prompt?.fullContentLoaded ? (
                    <FeedbackWrapper>
                      {prompt?.regeneratedResponses!?.length > 0 && (
                        <NavBtns>
                          <NavBtn onClick={prevPrompt}>
                            <ChevronLeft size={".8rem"} />
                          </NavBtn>
                          <span>
                            {promptIDX + 1}
                            {" / "}
                            {prompt?.regeneratedResponses!?.length + 1}
                          </span>
                          <NavBtn onClick={nextPrompt}>
                            <ChevronRight size={".8rem"} />
                          </NavBtn>
                        </NavBtns>
                      )}
                      <BetaLogo>Beta</BetaLogo>
                      <FeedbackBtns>
                        <ThumbsUp
                          style={
                            prompt?.mssgId
                              ? { cursor: "pointer" }
                              : { pointerEvents: "none" }
                          }
                          size={"1rem"}
                          onClick={() => {
                            likePrompt(prompt, true);
                            onFeedbackSubmission(prompt?.mssgId, true);
                          }}
                          color={
                            !prompt?.mssgId
                              ? "rgba(255, 255, 255, 0.4)"
                              : prompt.feedback?.liked
                              ? "#4BB543"
                              : "white"
                          }
                        />
                        <ThumbsDown
                          style={
                            prompt?.mssgId
                              ? { cursor: "pointer" }
                              : { pointerEvents: "none" }
                          }
                          size={"1rem"}
                          color={
                            !prompt?.mssgId
                              ? "rgba(255, 255, 255, 0.4)"
                              : prompt.feedback?.disliked
                              ? "#ff3333"
                              : "white"
                          }
                          onClick={() => {
                            likePrompt(prompt, false);
                            onFeedbackSubmission(prompt?.mssgId, false);
                          }}
                        />
                      </FeedbackBtns>
                    </FeedbackWrapper>
                  ) : (
                    <FeedbackWrapper>
                      <BetaLogo>Beta</BetaLogo>
                    </FeedbackWrapper>
                  )}
                </Row>
              )}
              {prompt?.fullContentLoaded && !prompt?.noCitationsFound ? (
                <SourcesWrapper>
                  <TEXT.Disabled size=".8rem">Sources</TEXT.Disabled>
                  {showSource ? (
                    <Sources>
                      {prompt?.sources?.map((source: string, idx: number) => (
                        <SourceLink key={idx}>
                          <Link size={13} />
                          <a
                            onClick={() => {
                              //@ts-ignore
                              if (window?.gtag) {
                                //@ts-ignore
                                window?.gtag("event", "source_link", {
                                  event_category: "source_link",
                                  event_label: source,
                                });
                              }
                            }}
                            href={source}
                            target="_blank"
                          >
                            {extractSiteName(source)}
                          </a>
                        </SourceLink>
                      ))}
                    </Sources>
                  ) : showSuggestion ? (
                    <SourceLink
                      style={{ padding: ".25rem .5rem", marginTop: ".5rem" }}
                    >
                      <AlertOctagon size={10} />
                      <span>None Found</span>
                    </SourceLink>
                  ) : (
                    <ResourcesSkeletonLoader />
                  )}
                </SourcesWrapper>
              ) : null}
              {prompt?.fullContentLoaded && !prompt?.noSuggestionsFound && (
                <SugesstionsWrapper>
                  <TEXT.Disabled size=".8rem">Related Questions</TEXT.Disabled>
                  {showSuggestion ? (
                    <Sugesstions>
                      {prompt?.suggestions
                        ?.slice(0, 3)
                        ?.map((sgs: any, idx: number) => (
                          <Suggestion
                            key={idx}
                            onClick={() => {
                              setSgsPrompt(sgs);
                              //@ts-ignore
                              if (window?.gtag) {
                                //@ts-ignore
                                window?.gtag("event", "suggestions", {
                                  event_category: "suggestions",
                                  event_label: sgs,
                                });
                              }
                            }}
                          >
                            <span>{sgs}</span>
                          </Suggestion>
                        ))}
                    </Sugesstions>
                  ) : (
                    <ResourcesSkeletonLoader />
                  )}
                </SugesstionsWrapper>
              )}
              {(prompt_idx + 1) % 5 === 0 && !prompt.streaming ? (
                <Column
                  style={{
                    gap: ".5rem",
                    padding: "0 1rem",
                    fontSize: ".9rem",
                  }}
                >
                  <span>
                    If you{"'"}d like to know more, you can contact us directly
                    via our server.{" "}
                    <a
                      href="https://discord.com/invite/0xPolygon"
                      target="_blank"
                    >
                      Join the server
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://developersupport.polygon.technology/support/tickets/new"
                      target="_blank"
                    >
                      raise a ticket here.
                    </a>
                  </span>
                </Column>
              ) : null}
            </Content>
          )}
        </PromptContent>{" "}
      </PromptContentWrapper>
    </PromptWrapper>
  );
};

const BetaLogo = styled.p`
  background: rgba(52, 52, 52, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.7rem;
`;

const LoaderQueries = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const LoaderQuery = styled.p`
  background: rgba(173, 135, 255, 0.15);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  font-family: var(--ff-light);
`;
const LoaderLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const LoaderLink = styled.p`
  border-radius: 8px;
  max-width: 250px;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  font-family: var(--ff-light);
  background: rgba(10, 9, 13, 0.1);
  box-shadow: inset 0px 0px 2px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(32px);
  a {
    display: inline-block;
    padding-top: 0.5rem;
  }
`;
const MainContent = styled.div`
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  padding: 1rem;
`;
const FeedbackBtns = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 0.5rem;
`;
const NavBtns = styled.div`
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 0.25rem;
  border: 1px solid ${(props) => props.theme.stroke};
  padding: 0.15rem;
  border-radius: 2rem;
`;
const ContractDeployBtn = styled(Button)`
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  display: inline-block;
  margin-top: 1rem;
`;
const DegenLoaderLabel = styled.p`
  display: flex;
  color: #4bb543;
  width: fit-content;
  align-items: center;
  font-size: 0.9rem;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(75, 181, 67, 0.1);
  border: 1px solid rgba(75, 181, 67, 0.1);
  border-radius: 2rem;
  padding: 0.5rem;
  padding-left: 1rem;
`;
const ErrorLabel = styled.p`
  display: flex;
  color: #818181;
  width: fit-content;
  align-items: center;
  font-size: 0.9rem;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #81818162;
  border-radius: 0.5rem;
  padding: 0.5rem;
  padding-left: 1rem;
`;
const LoaderWrapper = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position:absolute;
    bottom:.75rem;
    left:.5rem;
  `}
`;
const SourcesWrapper = styled.div``;
const Sources = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;
`;
const Blinker = styled.span`
  display: inline-block;
  animation: blink_animation 0.5s infinite;
  background: #f7f7f7;
  height: 0.9rem;
  padding: 0.25rem;
  transform: translateY(10%) translateX(20%);
  @keyframes blink_animation {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const NavBtn = styled.button`
  background: none;
  font-size: 0.8rem;
  color: white;
  outline: none;
  border: none;
`;
const Content = styled(Column)`
  flex: 1;
  gap: 1rem;
  padding-top: 1rem;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position:initial;
  `};
`;
const DiscordBtn = styled(Button)`
  gap: 0.5rem;
  font-size: 0.8rem;
`;
const FeedbackWrapper = styled.div`
  position: absolute;
  width: fit-content;
  display: flex;
  min-width: 50px;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  top: 0;
  right: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position:absolute;
    bottom:.75rem;
    right:0;
    top:initial;
    padding:0 1rem;
  `};
`;
const SugesstionsWrapper = styled(Column)`
  gap: 0.5rem;
`;
const Sugesstions = styled(Row)`
  gap: 1rem;
  flex-wrap: wrap;
`;
const Suggestion = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 0.35rem 0.5rem;
  border-radius: 2rem;
  border: 1px solid #ffffff63;
  gap: 0.25rem;
  font-size: 0.8rem;
  background: rgba(92, 45, 167, 0.05);
  color: #6e6e6e;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #cfcfcf;
  }
  span {
    max-width: 350px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    span {
    max-width: 300px;
  }
  `}
`;
const SourceLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.35rem;
  border-radius: 2rem;
  gap: 0.25rem;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  a {
    text-decoration: none;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #cfcfcf;
  }
`;
const PromptTitle = styled(Row)`
  padding: 1rem 0.5rem;
  gap: 0.5rem;
  max-width: ${(props) => props.theme.ctrSizes.maxAppCtrWidth};
  font-family: var(--ff-title);
  font-size: clamp(1rem, 2vw, 1.35rem);
  border-bottom: 1px solid ${(props) => props.theme.stroke};
  margin: 0 auto;
  align-items: flex-start;
  align-items: center;

  ._copyPromptBtn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    min-width: 50px;
    color: #6e6e6e;
    font-size: 0.8rem;
    font-family: var(--ff-light);
    &:hover {
      color: #fff;
    }
  }
`;
const PromptContent = styled(Column)`
  width: 100%;
  max-width: ${(props) => props.theme.ctrSizes.maxAppCtrWidth};
  padding-bottom: 0.5rem;
  gap: 1rem;
  overflow: hidden;
  margin: 0 auto;

  &::-webkit-scrollbar {
    background-color: hsl(0, 0%, 29.01960784313726%);
    width: 8px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: hsl(0, 0%, 29.01960784313726%);
    border-radius: 0px;
    border: 1px solid #6f6f6f;
    border-top: 0px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #737373;
    border-radius: 0px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #9e77ed;
  }
`;
const PromptContentWrapper = styled(Column)`
  background: none;
  padding: 1rem 0;
  gap: 1rem;
  border-width: 1px solid ${({ theme }) => theme.stroke};
  position: relative;

  // scroll bar
  /* width */
  &::-webkit-scrollbar {
    background-color: hsl(0, 0%, 29.01960784313726%);
    width: 8px;
    height: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: hsl(0, 0%, 29.01960784313726%);
    border-radius: 0px;
    border: 1px solid #6f6f6f;
    border-top: 0px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: #737373;
    border-radius: 0px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #9e77ed;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:1rem 0.5rem;
   padding-bottom:3rem; //for feedback btn

  `}
`;
const PromptWrapper = styled(Column)``;

export default memo(Prompt);
