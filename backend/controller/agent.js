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
  agentAnalyze,
  agentStart,
} from "../helpers/index.js";
import { sendData } from "../utils/index.js";
import restrictedKeywords from "../helpers/handlers/restrictedKeywords.js";

import { v4 as uuidv4 } from "uuid";

const AgentTasks = async (req, res) => {
  try {
    const { goal, name } = req.body;
    if (!goal || !name)
      return res.status(400).json({ message: "Invalid request" });
    const tasks = await agentStart(goal, false, "gpt-3.5-turbo", name);
    if (!tasks) return res.status(400).json({ message: "Invalid request" });
    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
  }
};

const AgentAnalyze = async (req, res) => {
  try {
    const { goal, task } = req.body;
    if (!goal || !task)
      return res.status(400).json({ message: "Invalid request" });
    let tasks = await agentAnalyze(goal, false, "gpt-3.5-turbo", task);
    let maxRetries = 5;
    while (!tasks && maxRetries > 0) {
      tasks = await agentAnalyze(goal, false, "gpt-3.5-turbo", task);
      maxRetries--;
    }
    if (maxRetries === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }
    console.log("Agent analyze tasks:", tasks);
    if (tasks) {
      let toolData = { type: "text", data: "No data found" };
      switch (tasks?.tool) {
        case "Search":
          let q = await createQuery(task, false, "gpt-3.5-turbo", tasks?.args);
          if (q) {
            console.log("Search query:", q);
            q = q.replace(/"/g, "") || tasks?.args;
            const searchResults = await getSearchResults(q);
            let searchData = validateSearchResults(
              searchResults,
              "new_dev",
              false,
              "gpt-3.5-turbo"
            );
            if (searchData) {
              toolData = { type: "search", data: searchData };
            }
          }
          break;
        case "code":
        case "contract":
          toolData = { type: "code", data: tasks?.args };
          break;
        case "dapp-radar":
          const dappRadar = await getDappRadar(tasks?.args);
          toolData = { type: "dapp-radar", data: dappRadar };
          break;
        case "NFT_Insights":
          const nftAnalytics = await getNFTAnalytics(tasks?.args?.reasoning);
          toolData = { type: "nft-analytics", data: nftAnalytics };
          break;
        default:
          toolData = { type: "web", data: tasks?.args };
      }
      if (!toolData)
        return res.status(400).json({ message: "Invalid request" });
      const chat = await getChatResponse(
        toolData?.data,
        task,
        "new_dev",
        [],
        false,
        false,
        "web",
        false,
        "gpt-4"
      );
      if (!chat) return res.status(400).json({ message: "Invalid request" });
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      });
      sendData("", res);
      let answer = "";
      chat.on("data", (chunk) => {
        const lines = chunk
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          const mes = line.replace(/^data: /, "");
          if (mes === "[DONE]") {
            console.log(
              "Answer generated. Getting source links and suggestions"
            );
            sendData({ completed: true }, res);
            console.log(answer);
            Promise.all([[], []]).then(async ([source, suggestions]) => {
              res.write(
                `data: ${JSON.stringify({
                  source,
                  suggestions,
                  sourceCode: false,
                })}\n\n`
              );
              res.end();
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
    }
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
  }
};

export { AgentAnalyze, AgentTasks };
