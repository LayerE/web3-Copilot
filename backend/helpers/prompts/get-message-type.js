import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function (message, history, apiKey) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `You are a bot designed to determine the appropriate type of message based on the user's input. You have access to the user's message and the conversation history.
        The available message types are:
        1. personal - Any message that is not seeking advice, but rather something specific to the bot, such as a greeting or a question about the bot's abilities.
        2. code - If the message includes code examples or snippets and the user is asking for help to debug or improve the code.
        3. info - Any message that includes information related to the bot, such as who Copilot is, the abilities of the  Copilot, terms & conditions, etc. not seeking advice, but rather something specific to the bot, such as a greeting or a question about the bot's abilities.
        4. website - Any message that includes a link to a website. If the link is related to blockchain, or Web3, it should be considered a website message; otherwise, it should be treated as a normal message.
        5. dapp-radar - Any message that asks about a list of dapps. For example, "What are the top 10 dapps on Polygon?" or "What are some of the best social dapps on Polygon?". Do not use this plugin when asked about a specific dapp, like "Tell me about Uniswap dapp."
        6. web - A normal message that seeks advice and does not include code examples, links to websites, or personal information. It should be related to blockchain or web3 or ethereum or blockchain.
        7. contract - If the message is seeking information on deploying a contract. Only when ask about deploying a contract, not about a specific code.
        8. surfaceboard - Any message related to Polygon NFT collections, individual NFTs, or collections or price of matic For example, "What are the top 10 NFT collections on Polygon?" or "Tell me about Y00ts NFTs." or "Price of matic".
        9. irrelevant - if the message is irrelevant to web3, blockchain, ethereum, or polygon or crypto, nfts or dapps or defi or smart contracts or solidity. ex: "Who is trump", or "how do i hack"
        Based on the message type, construct a query that is relevant to the user's message and the conversation history.
        - For personal and code messages, include the user's message in the query.
        - For website messages, extract the domain from the user's message and include it in the query if it is related to blockchain, or Web3.
        - For dapp-radar messages, use one of the provided categories as the query instead of generating a new one: "general", "games", "defi", "gambling", "exchanges", "collectibles", "marketplaces", "social", "other", "high-risk". Use "general" when unsure about the category.
        - For messages related to blockchain, include the user's message in the query.
        Current message: ${message}
        Conversation history: ${history}
        
        Response format: [query, type]
        Example:
        Message: What is https://polygon.technology/
        History: []
        Response: ["https://polygon.technology/", "website"]
        
        Please ensure the type is one of the following: "personal", "code", "website", "web", "info", "dapp-radar", or "contract"  or "surfaceboard" or "irrelevant".
        Avoid providing any additional information beyond the response array, even if it is empty.

        * RULES * 
        Strictly follow the format of the response.
        [query, type]
        `;

    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });
    return JSON.parse(completion.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
    return ["", "web"];
  }
}
