import polygonWikiParser from "./scraper/polygon-wiki-parser.js";
import getSource from "./prompts/get-source.js";
import getChatResponse from "./prompts/get-chat-response.js";
import getSearchResults from "./get-search-results.js";
import mediumWikiScraper from "./scraper/medium-wiki-scraper.js";
import createQuery from "./prompts/create-query.js";
import validateSearchResults from "./validate-search-results.js";
import getTextCompletion from "./prompts/get-text-completion.js";
import getSuggestions from "./prompts/get-suggestions.js";
import polygonBlogScrapper from "./scraper/polygon-blog-scrapper.js";
import writeConversations from "./handlers/write-conversations.js";
import getSiteData from "./scraper/get-site-data.js";

import { getNFTRoute, getDataExplain } from "./prompts/get-nftRoute.js";
import { getNFTAnalytics, getWalletAnalytics } from "./nft-analytics.js";
import getAPIKeyCheck from "./api-key-check.js";
import getMessageType from "./prompts/get-message-type.js";
import getCodeResponse from "./prompts/get-code-response.js";
import polygonIdScrapper from "./scraper/polygon-id-scrapper.js";

import { getContractCode } from "./prompts/get-contract.js";
import compileSolc from "./compile-solc.js";
import deployContract from "./deploy-contract.js";
import { MintNFT } from "./prompts/mint-nft.js";
import getSiteMetadata from "./scraper/get-site-metadata.js";
import {
  Faucet,
  sendTokens,
  getAvailableTokens,
} from "./prompts/get-tokens-faucet.js";
import getDappDetails from "./scraper/get-dapp-details.js";
import { info, infoTrimmed } from "./prompts/about.js";

import { decrementTokens } from "./handlers/decrementTokens.js";
import { recordAnalyticsAndWriteConversation } from "./handlers/recordAnalytics.js";

import getAlgoliaGptResponse from "./get-algolia-gpt-response.js";
import agentAnalyze from "./prompts/agent-analyze.js";
import agentStart from "./prompts/agent-start.js";
import agentExplainer from "./prompts/agent-explainer.js";
import getToken from "./token-api.js";
import tokenStats from "./prompts/token-stats.js";
import PotentialAirdrop from "./scraper/get-potential-airdrop.js";
import agentSummarizer from "./prompts/agent-summarizer.js";
import tokenSummarizer from "./prompts/token-summarizer.js";

export {
  polygonWikiParser,
  getSource,
  getChatResponse,
  getSearchResults,
  mediumWikiScraper,
  createQuery,
  validateSearchResults,
  getTextCompletion,
  getSuggestions,
  polygonBlogScrapper,
  writeConversations,
  getNFTRoute,
  getNFTAnalytics,
  getDataExplain,
  getAPIKeyCheck,
  getMessageType,
  getCodeResponse,
  getSiteMetadata,
  MintNFT,
  getContractCode,
  compileSolc,
  deployContract,
  Faucet,
  sendTokens,
  polygonIdScrapper,
  getDappDetails,
  info,
  getAvailableTokens,
  infoTrimmed,
  decrementTokens,
  recordAnalyticsAndWriteConversation,
  getAlgoliaGptResponse,
  getSiteData,
  agentAnalyze,
  agentStart,
  agentExplainer,
  getWalletAnalytics,
  getToken,
  tokenStats,
  PotentialAirdrop,
  agentSummarizer,
  tokenSummarizer,
};
