import express from "express";
import cors from "cors";
import {
  getTextCompletion,
  writeConversations,
  getNFTAnalytics,
  getAPIKeyCheck,
  compileSolc,
} from "./helpers/index.js";

import { parseForm, bulkUploadForm } from "./middleware/parseForm.js";

import {
  TwitterLogin,
  TwitterCallback,
  DiscordLogin,
  DiscordCallback,
  TaskVerify,
  updateFeedback,
  FeedbackAnalytics,
  UserAnalytics,
  getAllUsers,
  promptAnalytics,
  earlyAccess,
  earlyAccessSignup,
  feedbackHook,
  HandleMetadata,
  ChatController,
  MintNFTController,
  NFTStatsController,
  LoginController,
  UserStatusController,
  getConversationById,
  getConversationByUser,
  DisconnectSocialsController,
  TotalChatSessions,
  UpdateMintAndContractDeployment,
  TokenBased,
  AgentAnalyze,
  AgentTasks,
  BulkGenerateMetadata,
  AirdropController,
  AgentSummarizer,
  AgentTools,
} from "./controller/index.js";

import { connectDB } from "./config/database.js";
import { Analytics } from "./models/index.js";

import { v4 as uuidv4 } from "uuid";
import { isAuth, validateToken } from "./middleware/isAuth.js";

import formatSolidityCode from "./utils/formatSolidityCode.js";
import sendData from "./utils/send-data.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Connect to mongoDB
connectDB();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

app.post("/chat", isAuth, ChatController);
app.post("/stats", isAuth, NFTStatsController);
app.post("/mint", isAuth, MintNFTController);
app.post("/tokens", isAuth, AirdropController);

//No auth added here🙂
app.post("/conversation/id", getConversationById);
app.post("/conversation/user", getConversationByUser);

app.post("/complete", getTextCompletion);

// Twitter auth for task
app.get("/twitter/login", TwitterLogin);
app.get("/twitter/callback", TwitterCallback);

// Discord auth for task
app.get("/discord/login", DiscordLogin);
app.get("/discord/callback", DiscordCallback);

// Disconnect socials
app.post("/disconnect", validateToken, DisconnectSocialsController);

// Task verify
app.post("/task/verify", validateToken, TaskVerify);

// User Routes
app.post("/user/login", LoginController);
app.get("/user/status", validateToken, UserStatusController);

// API Key Check (GPT-4 enabled)
app.post("/api-key/check", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || apiKey.length !== 51) {
      return res.status(400).json({ message: "Bad request" });
    }
    const check = await getAPIKeyCheck(apiKey);
    if (check?.error) {
      return res.status(400).json({ message: "Invalid key", success: false });
    }
    return res.status(200).json({ message: "Valid key", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// agents
app.post("/agent/task", validateToken, AgentTasks);
app.post("/agent/analyze", validateToken, AgentAnalyze);
app.post("/agent/summarize", validateToken, AgentSummarizer);
app.get("/agent/tools", AgentTools);

app.post("/compile", async (req, res) => {
  try {
    let { source } = req.body;
    if (!source) {
      return res.status(400).json({ message: "Bad request" });
    }
    console.log(source);
    let code = formatSolidityCode(source);
    console.log(code);
    const data = await compileSolc(code);
    if (data?.error) {
      return res.status(400).json({ message: data.error });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Early Access signup
app.post("/early-access", earlyAccess);
// to handle the metadata upload
app.post("/metadata", parseForm, HandleMetadata);
app.post("/metadata/bulk", bulkUploadForm, BulkGenerateMetadata);
// Analytics
app.post("/analytics/feedback", updateFeedback);
app.post("/analytics/deployment/status", UpdateMintAndContractDeployment);
app.get("/analytics/user", UserAnalytics);
app.get("/analytics/users", getAllUsers);
app.get("/analytics/feedback", FeedbackAnalytics);
app.get("/analytics/prompt", promptAnalytics);
app.get("/analytics/early-access", earlyAccessSignup);
app.get("/analytics/chat-sessions", TotalChatSessions);
app.get("/analytics/token-based", TokenBased);
// webhook for feedback from tally
app.post("/feedback/tally", feedbackHook);
// serve the JSON plugin
// app.use('/.well-known', express.static('./.well-known'));
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
