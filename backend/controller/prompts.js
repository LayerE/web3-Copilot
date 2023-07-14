import {
  getSearchResults,
  getChatResponse,
  getSource,
  validateSearchResults,
  createQuery,
  getSuggestions,
  getNFTAnalytics,
  getDataExplain,
  getMessageType,
  getCodeResponse,
  getContractCode,
  MintNFT,
  getSiteMetadata,
  getDappDetails,
  decrementTokens,
  recordAnalyticsAndWriteConversation,
  tokenStats,
  getToken,
  agentExplainer,
} from "../helpers/index.js";
import { sendData } from "../utils/index.js";
import restrictedKeywords from "../helpers/handlers/restrictedKeywords.js";

import { v4 as uuidv4 } from "uuid";

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
    console.log(contract);
    // Generate a unique ID for the request to store analytics data
    const id = uuidv4();
    let { conversationId, answer: ans, model } = req.body;
    ans = ans || "";
    model =
      model && model?.model_id === 2
        ? "gpt-4"
        : "gpt-3.5-turbo" || "gpt-3.5-turbo";
    console.log(model);
    conversationId = conversationId || uuidv4();

    if (!message || !persona || !history) {
      return res.status(400).json({ message: "Bad request" });
    }
    if (message?.length > 1024)
      return res.status(400).json({ message: "Message too long" });

    if (persona !== "new_dev" && persona !== "dev" && persona !== "validator") {
      return res.status(400).json({ message: "Invalid persona" });
    }
    console.log("Request data:", {
      message,
      persona,
      history,
      debug,
    });
    if (wallet && !apiKey) {
      await decrementTokens(wallet, model);
    }

    if (!debug) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      });
      sendData({ id: id, conversationId }, res);
    }

    const filter = !contract
      ? await getMessageType(message, history, apiKey ?? false)
      : [message, "contract"];

    let type = filter[1];
    const query = filter[0];
    console.log("Message type:", type);
    if (!debug) {
      sendData({ type: type }, res);
    }

    console.log("Generating search query from conversation history");
    if (!debug && type !== "web") {
      sendData({ queries: ["Message type is not web. Skipping search"] }, res);
    }
    let data = [];
    if (
      type === "personal" ||
      type === "code" ||
      type === "contract" ||
      type === "irrelevant"
    ) {
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
        console.log("Search query:", q);
        // remove " from the query to avoid error"
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
        return res
          .status(400)
          .json({ message: data?.error || "Invalid response" });
      }
      if (data.dataJSON === "false") {
        type = "web";
      }
      console.log(data);
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

    // debug mode to get the response in block instead of stream
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
    if (!chat) {
      return res.status(503).json({ message: "Something went wrong." });
    }

    if (debug) {
      console.log("Request completed");
      return res.status(200).json({
        id: id,
        data: chat,
        debug: true,
      });
    }

    let answer = "";
    chat.on("data", (chunk) => {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        const mes = line.replace(/^data: /, "");
        if (mes === "[DONE]") {
          console.log("Answer generated. Getting source links and suggestions");
          sendData({ completed: true }, res);
          console.log(answer);
          Promise.all([
            type === "web" && isFooter !== "false" && type !== "contract"
              ? getSource(data, message, apiKey ?? false, model)
              : type === "dapp-radar"
              ? ["https://dappradar.com/"]
              : [],
            type !== "personal" && isFooter !== "false" && type !== "contract"
              ? getSuggestions(
                  history,
                  answer,
                  apiKey ?? false,
                  "gpt-3.5-turbo"
                )
              : [],
          ]).then(async ([source, suggestions]) => {
            let code = false;
            if (type === "contract" && answer?.includes("```")) {
              // get the ``` from the response
              code = answer?.match(/```([^]*)```/)[1];
              console.log(code);
            }
            res.write(
              `data: ${JSON.stringify({
                source,
                suggestions,
                id,
                conversationId,
                showButton:
                  type === "contract" && answer?.includes("```") ? true : false,
                sourceCode: code ? code : false,
              })}\n\n`
            );
            res.end();
            //moved analytics after response for faster response time.
            /* Store analytics data */
            await recordAnalyticsAndWriteConversation(
              id,
              wallet,
              message,
              answer,
              apiKey,
              model,
              conversationId,
              persona,
              isRegenerated,
              isFooter,
              type
            );
            console.log("Request completed");
          });
        } else {
          const parsed = JSON?.parse(mes);
          const content = parsed.choices[0].delta.content;
          if (content) {
            sendData(content, res);
            answer += content;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
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

    if (!message || !history) {
      return res.status(400).json({ message: "Bad request" });
    }
    if (message?.length > 1024)
      return res.status(400).json({ message: "Message too long" });

    // Generate a unique ID for the request to store analytics data
    const id = uuidv4();
    let { conversationId, model } = req.body;
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo";

    conversationId = conversationId || uuidv4();

    const data = await getNFTAnalytics(message, wallet, apiKey || false);

    if (!data) {
      return res.status(400).json({ message: "Invalid response" });
    }

    if (data.error) {
      return res.status(400).json({ message: data.error });
    }

    const streamData = await getDataExplain(
      message,
      data.dataJSON,
      data.duration,
      apiKey || false,
      model
    );

    if (!streamData) {
      return res.status(400).json({ message: "Invalid response" });
    }

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
    let answer = "";

    streamData.on("data", async (chunk) => {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        const mes = line.replace(/^data: /, "");

        if (mes === "[DONE]") {
          sendData("", res);
          res.write(
            `data: ${JSON.stringify({
              source: [],
              suggestions: [],
              id,
              conversationId,
            })}\n\n`
          );
          res.end();

          await recordAnalyticsAndWriteConversation(
            id,
            wallet,
            message,
            answer,
            apiKey,
            model,
            conversationId,
            "stats",
            isRegenerated,
            isFooter,
            persona
          );

          console.log("Request completed");
        } else {
          const parsed = JSON.parse(mes);
          const content = parsed.choices[0].delta.content;

          if (content) {
            sendData(content, res);
            answer += content;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
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
    if (!message || !history) {
      return res.status(400).json({ message: "Bad request" });
    }
    if (message?.length > 1024)
      return res.status(400).json({ message: "Message too long" });
    // Generate a unique ID for the request to store analytics data
    const id = uuidv4();
    let { conversationId, model } = req.body;
    conversationId = conversationId || uuidv4();
    model =
      model && model?.model_id === 2
        ? "gpt-4"
        : "gpt-3.5-turbo" || "gpt-3.5-turbo";
    const data = await MintNFT(message, history, apiKey ?? false);
    if (!data) return res.status(400).json({ message: "Invalid response" });
    if (data?.error) {
      return res.status(400).json({ message: data.error });
    }
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
    let answer = "";
    data.on("data", async (chunk) => {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        const mes = line.replace(/^data: /, "");
        if (mes === "[DONE]") {
          let json = false;
          if (answer?.includes("```")) {
            json = answer?.match(/```([^]*)```/)[1];
            if (json.startsWith("json")) {
              json = json.replace("json", "");
            }
            console.log(json);
          }
          sendData("", res);
          res.write(
            `data: ${JSON.stringify({
              source: [],
              suggestions: [],
              id,
              conversationId,
              showButton: json ? true : false,
              sourceCode: json ? json : false,
            })}\n\n`
          );
          res.end();

          await recordAnalyticsAndWriteConversation(
            id,
            wallet,
            message,
            answer,
            apiKey,
            model,
            conversationId,
            "mintNFT",
            isRegenerated,
            isFooter,
            persona
          );

          console.log("Request completed");
        } else {
          const parsed = JSON.parse(mes);
          const content = parsed.choices[0].delta.content;
          if (content) {
            sendData(content, res);
            answer += content;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
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

    if (!message || !history) {
      return res.status(400).json({ message: "Bad request" });
    }
    if (message?.length > 1024)
      return res.status(400).json({ message: "Message too long" });

    // Generate a unique ID for the request to store analytics data
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

    if (!data) {
      return res.status(400).json({ message: "Invalid response" });
    }

    console.log(data);
    const apiFetch = await getToken(data.tool);
    console.log(apiFetch);

    const streamData = await agentExplainer(
      apiFetch,
      message,
      message,
      history,
      apiKey,
      false,
      model
    );

    if (!streamData) {
      return res.status(400).json({ message: "Invalid response" });
    }

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
    let answer = "";

    streamData.on("data", async (chunk) => {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of lines) {
        const mes = line.replace(/^data: /, "");

        if (mes === "[DONE]") {
          sendData("", res);
          res.write(
            `data: ${JSON.stringify({
              source: [],
              suggestions: [],
              id,
              conversationId,
            })}\n\n`
          );
          res.end();

          await recordAnalyticsAndWriteConversation(
            id,
            wallet,
            message,
            answer,
            apiKey,
            model,
            conversationId,
            "tokenStats",
            isRegenerated,
            isFooter,
            persona
          );

          console.log("Request completed");
        } else {
          const parsed = JSON.parse(mes);
          const content = parsed.choices[0].delta.content;

          if (content) {
            sendData(content, res);
            answer += content;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  ChatController,
  NFTStatsController,
  MintNFTController,
  AirdropController,
};
