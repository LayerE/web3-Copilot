import { tools } from "../helpers/handlers/agentTools.js";
import {
  getSearchResults,
  validateSearchResults,
  getNFTAnalytics,
  getDappDetails,
  decrementTokens,
  recordAnalyticsAndWriteConversation,
  agentAnalyze,
  agentStart,
  agentExplainer,
  getWalletAnalytics,
  agentSummarizer,
  getImage,
  ImageGenSummarizer,
  agentCode,
  getDefiSwap,
  getToken,
} from "../helpers/index.js";
import { sendData } from "../utils/index.js";

import { v4 as uuidv4 } from "uuid";

const AgentTasks = async (req, res) => {
  try {
    const { goal, name, apiKey, wallet } = req.body;
    let { model } = req.body;
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo";
    if (!goal || !name)
      return res.status(400).json({ message: "Invalid request" });
    const id = req.body.id || uuidv4();
    let maxRetries = 5;
    let tasks = await agentStart(goal, apiKey ?? false, model, name);
    while (!tasks && maxRetries > 0) {
      tasks = await agentStart(goal, apiKey ?? false, model, name);
      maxRetries--;
    }
    if (!tasks) return res.status(400).json({ message: "Invalid request" });
    await recordAnalyticsAndWriteConversation(
      id,
      wallet ?? false,
      goal,
      tasks?.map((task) => task).join(" "),
      apiKey ?? false,
      model !== "gpt-4" ? "gpt-3.5-turbo" : model,
      id,
      false,
      false,
      false,
      "agent"
    );
    return res.status(200).json({ tasks, id });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
  }
};

const AgentAnalyze = async (req, res) => {
  try {
    const { goal, task, apiKey, wallet } = req.body;
    let { id, model, tools } = req.body;
    if (!id) id = uuidv4();
    if (!goal || !task)
      return res.status(400).json({ message: "Invalid request" });
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo-16k";

    let tasks = await agentAnalyze(
      goal,
      apiKey ?? false,
      "gpt-3.5-turbo",
      task,
      tools?.length > 0 ? tools : false
    );

    let maxRetries = 10;
    while (!tasks && maxRetries > 0) {
      tasks = await agentAnalyze(
        goal,
        apiKey ?? false,
        "gpt-3.5-turbo",
        task,
        tools?.length > 0 ? tools : false
      );
      maxRetries--;
    }
    if (maxRetries === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }
    console.log("Agent analyze tasks:", tasks);
    if (tasks) {
      let toolData = { type: "text", data: "No data found" };
      console.log("Agent analyze tasks:", tasks?.tool);
      switch (tasks?.tool) {
        case "Search":
          let q = tasks?.args?.arg;
          if (q) {
            console.log("Search query:", q);
            q = q.replace(/"/g, "") || tasks?.args?.arg;
            const searchResults = await getSearchResults(q);
            let searchData = validateSearchResults(
              searchResults,
              "new_dev",
              req.body?.answer || "",
              model
            );
            if (searchData) {
              toolData = { type: "search", data: searchData };
            }
          }
          break;
        case "code":
        case "contract":
          toolData = { type: "code", data: task };
          break;
        case "dapp-radar":
          const dappRadar = await getDappDetails(task);
          toolData = { type: "dapp-radar", data: dappRadar };
          break;
        case "Defi_Insights":
          const nftAnalytics = await getNFTAnalytics(
            ["/defi?type=" + tasks?.args?.arg || "yieldPools"],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: nftAnalytics };
          break;
        case "top_eth_collections":
          const topEthCollections = await getNFTAnalytics(
            [
              "/topCollectionCrosschain?chain=rest&page=1&sortBy=volume_1d&duration=1d&sortDirection=desc",
            ],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: topEthCollections };
          break;
        case "top_nfts_collections":
          const topNFTsCollections = await getNFTAnalytics(
            [
              "/topCollectionCrosschain?chain=crosschain&page=1&sortBy=volume_1d&duration=1d&sortDirection=desc",
            ],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: topNFTsCollections };
          break;
        case "top_eth_nft_sales":
          const topEthNFTSales = await getNFTAnalytics(
            ["/eth/sales"],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: topEthNFTSales };
          break;
        case "top_polygon_collections":
          const topPolygonCollections = await getNFTAnalytics(
            ["/topCollection?duration=3"],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: topPolygonCollections };
          break;
        case "Specific_NFT_Info":
          const nftInfo = await getNFTAnalytics(
            [`/collection/${tasks?.args?.arg}?chain=eth`],
            wallet ?? false,
            apiKey ?? false,
            false,
            true
          );
          toolData = { type: "nft-analytics", data: nftInfo };
          break;
        case "wallet_transactions":
        case "wallet_balance":
        case "wallet_nfts":
          const walletAnalytics = await getWalletAnalytics(
            task,
            tasks?.args?.arg,
            tasks?.tool
          );
          toolData = { type: "wallet-analytics", data: walletAnalytics };
          break;
        case "image_gen":
          const data = await getImage(tasks?.args?.arg ?? task);
          toolData = { type: "image", data: data };
          break;
        case "defi_swap":
          const split = tasks?.args?.arg?.split(",");
          console.log(split);
          const defiSwap = await getDefiSwap(
            split[0]?.trim(),
            split[1]?.trim(),
            split[2]?.trim()
          );
          toolData = { type: "defi-swap", data: defiSwap };
          break;
        case "potential_airdrops":
        case "latest_airdrops":
        case "hottest_airdrops":
        case "token_insights":
        case "token_listings":
          const apiFetch = await getToken(tasks?.tool);
          toolData = { type: "tokens", data: apiFetch };
          break;
        default:
          toolData = { type: "web", data: tasks?.args };
      }
      if (!toolData)
        return res.status(400).json({ message: "Invalid request" });

      if (wallet && !apiKey) {
        await decrementTokens(wallet, model);
      }
      const chat =
        toolData?.type === "image"
          ? await ImageGenSummarizer(
              toolData?.data,
              goal,
              apiKey ?? false,
              "gpt-4"
            )
          : toolData?.type === "code"
          ? await agentCode(
              task,
              goal,
              req.body.answer ?? false,
              apiKey ?? false,
              model
            )
          : await agentExplainer(
              toolData?.data,
              task,
              goal,
              req.body.answer ?? false,
              apiKey ?? false,
              false,
              model,
              toolData?.type
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
            console.log(answer);
            Promise.all([[], []]).then(async ([source, suggestions]) => {
              res.write(
                `data: ${JSON.stringify({
                  isTaskCompleted: true,
                })}\n\n`
              );
              res.end();
              await recordAnalyticsAndWriteConversation(
                id,
                wallet ?? false,
                task,
                answer,
                apiKey ?? false,
                model !== "gpt-4" ? "gpt-3.5-turbo" : model,
                id,
                false,
                false,
                false,
                "agent"
              );
              console.log("Request completed");
            });
          } else {
            try {
              const parsed = JSON?.parse(mes);
              const content = parsed.choices[0].delta.content;
              if (content) {
                sendData(content, res);
                answer += content;
              }
            } catch (error) {
              console.log("Error parsing answer");
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

const AgentSummarizer = async (req, res) => {
  try {
    const { goal, results, wallet, apiKey } = req.body;
    let { model } = req.body;

    const id = req.body.id || uuidv4();
    model = model && model.model_id === 2 ? "gpt-4" : "gpt-3.5-turbo-16k";
    if (!goal || !results)
      return res.status(400).json({ message: "Invalid request" });

    const chat = await agentSummarizer(results, goal, apiKey ?? false, model);
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
          console.log("Answer generated. Getting source links and suggestions");
          console.log(answer);
          Promise.all([[], []]).then(async ([source, suggestions]) => {
            res.write(
              `data: ${JSON.stringify({
                isTaskCompleted: true,
              })}\n\n`
            );
            res.end();
            await recordAnalyticsAndWriteConversation(
              id,
              wallet ?? false,
              "summarize",
              answer,
              apiKey ?? false,
              model !== "gpt-4" ? "gpt-3.5-turbo" : model,
              id,
              false,
              false,
              false,
              "agent"
            );
            console.log("Request completed");
          });
        } else {
          try {
            const parsed = JSON?.parse(mes);
            const content = parsed.choices[0].delta.content;
            if (content) {
              sendData(content, res);
              answer += content;
            }
          } catch (error) {
            console.log("Error parsing answer");
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
  }
};

const AgentTools = async (req, res) => {
  try {
    const availableTools = await tools.filter(
      (tool, index, self) =>
        index === self.findIndex((t) => t.toolName === tool.toolName)
    );
    return res.status(200).json({ availableTools });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: "Something went wrong." });
  }
};

export { AgentAnalyze, AgentTasks, AgentSummarizer, AgentTools };
