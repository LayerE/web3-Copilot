import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (goal, apiKey, model, task) {
  const tools = [
    {
      name: "Search",
      description: "Search for a query on Google",
      args: "query for search related to web3, crypto, nft, defi, blockchain, ethereum, bitcoin, etc.",
    },
    {
      name: "wallet_transactions",
      description: "Get wallet-level data containing recent transactions",
      args: "wallet address or ENS name",
    },
    {
      name: "wallet_nfts",
      description: "Get wallet-level data containing NFTs owned by the wallet",
      args: "wallet address or ENS name",
    },
    {
      name: "wallet_balance",
      description: "Get wallet-level data containing balance (total worth)",
      args: "wallet address or ENS name",
    },
    {
      name: "NFT_Insights",
      description:
        "Get Top Collections, Top NFTs,Top NFTs Sold, Defi data, and Matic price",
      args: "query related to nft",
    },
    {
      name: "top_eth_collections",
      description: "Get Top NFTs Collections on Ethereum",
      args: "none",
    },
    {
      name: "top_polygon_collections",
      description: "Get Top NFTs Collections on Polygon/Matic",
      args: "none",
    },
    {
      name: "dappRadar",
      description: "Get top dapps by volume, users, and transactions",
      args: "none",
    },
    {
      name: "code",
      description: "Helps you write code or debug code",
      args: "none",
    },
  ];

  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `High level objective: ${goal}
    Current task: ${task}
    
    Based on this information, use the best function to make progress or accomplish the task entirely.
    Select the correct function by being smart and efficient. Ensure "reasoning" and only "reasoning" is used to select the function.
    
    Note you MUST select a function.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      functions: tools?.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
          type: "object",
          properties: {
            reasoning: {
              type: "string",
              description: "Reasoning for why this tool is the best choice.",
            },
            arg: {
              type: "string",
              description: tool.args,
            },
          },
          required: ["reasoning", "arg"],
        },
      })),
      function_call: "auto",
    });
    let args = completion.data.choices[0].message.function_call;

    return {
      tool: args?.name,
      args: JSON.parse(args?.arguments),
    };
  } catch (err) {
    console.error(err);
    return false;
  }
}
