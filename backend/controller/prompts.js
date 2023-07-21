import {
  getSearchResults,
  getChatResponse,
  validateSearchResults,
  createQuery,
  getNFTAnalytics,
  getDataExplain,
  getMessageType,
  getCodeResponse,
  getContractCode,
  MintNFT,
  getSiteMetadata,
  getDappDetails,
  decrementTokens,
  tokenStats,
  getToken,
  tokenSummarizer,
} from "../helpers/index.js";
import { sendData } from "../utils/index.js";

import { v4 as uuidv4 } from "uuid";
import { streamHandler } from "../helpers/handlers/streamHandler.js";
import errorHandler from "../helpers/handlers/errorHandler.js";
const ChatController = async (req, res) => {
  try {
    const {
      message,
      persona,
      history,
      wallet,
      apiKey,
      contract,
      isFooter,
      debug,
      isRegenerated,
    } = req.body;
    const id = uuidv4();
    let { conversationId, answer: ans, model } = req.body;
    ans = ans || "";
    model =
      model && model?.model_id === 2
        ? "gpt-4"
        : "gpt-3.5-turbo" || "gpt-3.5-turbo";
    conversationId = conversationId || uuidv4();
    if (!message || !persona || !history) errorHandler(400, "Bad request", res);
    if (message?.length > 1024) errorHandler(400, "Message too long", res);

    if (persona !== "new_dev" && persona !== "dev" && persona !== "validator")
      errorHandler(400, "Invalid persona", res);

    if (wallet && !apiKey) {
      await decrementTokens(wallet, model);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    });
    sendData({ id: id, conversationId }, res);

    const filter = !contract
      ? await getMessageType(message, history, apiKey ?? false)
      : [message, "contract"];

    let type = filter[1];
    const query = filter[0];

    sendData({ type: type }, res);

    console.log("Generating search query from conversation history");
    if (type !== "web") {
      sendData({ queries: ["Message type is not web. Skipping search"] }, res);
    }
    let data = [];
    if (["personal", "code", "contract", "irrelevant"].includes(type)) {
      data = [message];
    } else if (type === "website") {
      data = await getSiteMetadata(filter[0] ?? message);
      console.log("Website data:", data);
    } else if (type === "dapp-radar") {
      data = await getDappDetails(query);
    } else if (type === "web") {
      let q = await createQuery(
        history,
        apiKey ?? false,
        "gpt-3.5-turbo",
        message
      );
      if (q) {
        q = message;
        if (!debug) {
          sendData({ queries: [q] }, res);
        }
        const searchResults = await getSearchResults(q);
        data = validateSearchResults(searchResults, persona, ans, model);
        if (data && !debug) {
          sendData({ links: searchResults }, res);
        }
      } else {
        console.log("Search query is empty. Skipping search");
      }
    } else if (type === "surfaceboard") {
      data = await getNFTAnalytics(message, wallet, apiKey ?? false);
      if (!data || data?.error) {
        errorHandler(400, "Invalid response", res);
      }
      if (data.dataJSON === "false") {
        type = "web";
      }
    }
    let availableTypes = [
      "personal",
      "code",
      "website",
      "web",
      "dapp-radar",
      "info",
      "surfaceboard",
      "irrelevant",
    ];
    let messageType = availableTypes.includes(type) ? type : "web";
    const chat =
      type === "contract"
        ? await getContractCode(
            message,
            history,
            apiKey ?? false,
            debug ?? false
          )
        : type === "code"
        ? await getCodeResponse(
            data,
            message,
            persona,
            apiKey ?? false,
            debug ?? false,
            model
          )
        : await getChatResponse(
            data,
            message,
            persona,
            history,
            ans,
            apiKey ?? false,
            messageType,
            debug ?? false,
            type === "surfaceboard" ? "gpt-4" : model
          );
    if (!chat) errorHandler(400, "Invalid response", res);

    streamHandler(
      res,
      chat,
      id,
      conversationId,
      type,
      message,
      data,
      history,
      persona,
      apiKey,
      model,
      isRegenerated,
      isFooter,
      wallet
    );
  } catch (error) {
    errorHandler(500, "Internal server error", res);
  }
};

const NFTStatsController = async (req, res) => {
  try {
    const {
      message,
      wallet,
      history,
      apiKey,
      isRegenerated,
      isFooter,
      persona,
    } = req.body;

    if (!message || !history) errorHandler(400, "Bad request", res);
    if (message?.length > 1024) errorHandler(400, "Message too long", res);
    const id = uuidv4();
    let { conversationId, model } = req.body;
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo";

    conversationId = conversationId || uuidv4();

    const data = await getNFTAnalytics(message, wallet, apiKey || false);

    if (!data) errorHandler(400, "Invalid response", res);
    if (data?.error) errorHandler(400, data?.error, res);
    const streamData = await getDataExplain(
      message,
      data.dataJSON,
      data.duration,
      apiKey || false,
      model
    );

    if (!streamData) errorHandler(400, "Invalid response", res);

    if (wallet && !apiKey) {
      await decrementTokens(wallet, model);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    });
    sendData({ id: id }, res);

    streamHandler(
      res,
      streamData,
      id,
      conversationId,
      "surfaceboard",
      message,
      data,
      history,
      persona,
      apiKey,
      model,
      isRegenerated,
      isFooter,
      wallet
    );
  } catch (error) {
    errorHandler(500, "Internal server error", res);
  }
};

const MintNFTController = async (req, res) => {
  try {
    const {
      message,
      wallet,
      history,
      apiKey,
      isRegenerated,
      isFooter,
      persona,
    } = req.body;
    if (!message || !history) errorHandler(400, "Bad request", res);
    if (message?.length > 1024) errorHandler(400, "Message too long", res);
    const id = uuidv4();
    let { conversationId, model } = req.body;
    conversationId = conversationId || uuidv4();
    model =
      model && model?.model_id === 2
        ? "gpt-4"
        : "gpt-3.5-turbo" || "gpt-3.5-turbo";
    const data = await MintNFT(message, history, apiKey ?? false);
    if (!data) errorHandler(400, "Invalid response", res);
    if (data?.error) errorHandler(400, data?.error, res);
    if (wallet && !apiKey) {
      await decrementTokens(wallet, model);
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    });
    sendData({ id: id }, res);

    streamHandler(
      res,
      data,
      id,
      conversationId,
      "mintNFT",
      message,
      data,
      history,
      persona,
      apiKey,
      model,
      isRegenerated,
      isFooter,
      wallet,
      true
    );
  } catch (error) {
    errorHandler(500, "Internal server error", res);
  }
};

const AirdropController = async (req, res) => {
  try {
    const {
      message,
      wallet,
      history,
      apiKey,
      isRegenerated,
      isFooter,
      persona,
    } = req.body;

    if (!message || !history) errorHandler(400, "Bad request", res);
    if (message?.length > 1024) errorHandler(400, "Message too long", res);
    const id = uuidv4();
    let { conversationId, model } = req.body;
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo";

    conversationId = conversationId || uuidv4();

    let maxRetries = 5;
    let data = await tokenStats(message, apiKey, model);
    while (!data && maxRetries > 0) {
      data = await tokenStats(message, apiKey, model);
      console.log("Retrying...");
      maxRetries--;
    }

    if (!data) errorHandler(400, "Invalid response", res);
    const apiFetch = await getToken(data.tool);
    const streamData = await tokenSummarizer(
      apiFetch,
      message,
      history,
      apiKey,
      false,
      model
    );

    if (!streamData) errorHandler(400, "Invalid response", res);

    if (wallet && !apiKey) {
      await decrementTokens(wallet, model);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    });
    sendData({ id: id }, res);
    streamHandler(
      res,
      streamData,
      id,
      conversationId,
      "airdrop",
      message,
      data,
      history,
      persona,
      apiKey,
      model,
      isRegenerated,
      isFooter,
      wallet
    );
  } catch (error) {
    errorHandler(500, "Internal server error", res);
  }
};

export {
  ChatController,
  NFTStatsController,
  MintNFTController,
  AirdropController,
};
