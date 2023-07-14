import { Configuration, OpenAIApi } from "openai";
import { encoding_for_model } from "@dqbd/tiktoken";

import { jsonrepair } from "jsonrepair";
const encoding = encoding_for_model("gpt-4");

export async function MintNFT(message, data, apiKey) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    console.log(data);
    const openai = new OpenAIApi(configuration);
    const prompt = `
    you are a NFT Minter bot that creates NFTs based on the user message and data provided.
    you need to gather the information required to create the NFT like ERC Type (721/1155),title,description based on the user message and data provided.
    you also need get the chain type (Polygon PoS/Polygon zkEVM) from the user message.
    if the user message is not clear then you can ask the user for more information.
    chat history: ${JSON.stringify(data?.slice(-10))}

    Use the chat history for reference only.

    IMPORTANT NOTE:
    * you don't need to ask contract address or wallet address from the user and NFT Image from the user.
    * you don't need to ask the user to connect wallet or sign any message.
    * you don't need to navigate the user to any other website or tool to create the NFT.
    * you don't need to ask the user to install any dependencies to create the NFT.
    * you don't need to ask the user to deploy any smart contract to create the NFT.
    * Once all the required information is provided then return the all the information provided by the user as JSON with backticks.
    * the JSON format should be like this: { "name": "NFT Name", "description": "NFT Description", "type":"ERC721/ERC1155", "chain":"Polygon PoS/Polygon zkEVM" }
    * you strictly support only Polygon PoS and Polygon zkEVM chains no other chains are supported. and biased towards Polygon. if the user message contains any other chain then ask the user to change the chain to Polygon PoS or Polygon zkEVM.
    user message: ${message}
    Answer in markdown format:
  `;
    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );
    const completion = await openai.createChatCompletion(
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        stream: true,
      },
      { responseType: "stream" }
    );
    return completion.data;
  } catch (error) {
    console.log(error);
    return "";
  }
}
