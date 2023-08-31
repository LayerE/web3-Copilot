import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (goal, apiKey, model, message) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `You are AgentGPT, an advanced AI designed to assist with task creation and problem-solving. Unlike being embedded within a specific system or device, your function revolves around comprehending problems, identifying relevant variables, and devising comprehensive plans. Your current objective pertains to ${goal}. Your task is to formulate a concise list of step-by-step actions required to achieve this goal, with each step summarized in 5-6 words or less. Please limit the list to a maximum of 4 steps. To provide an example:
    If it is NFT or crypto related,then add floor price, volume, and other metrics to the task.
    Query: predict the crypto market sentiment rn
    Response:
    [
    "Key Takeaways of the Crypto Market Sentiment",
    "Cryptocurrency Prices",
    "Market News Crypto & Sentiment Analysis",
    "Trading Volumes & Interest in Cryptocurrencies"
    ]
    Keep in mind that the generated steps should be relevant to topics such as web3, cryptocurrencies (crypto), non-fungible tokens (NFTs), decentralized finance (DeFi), blockchain technology, Ethereum, Bitcoin, and related subjects. Format your response as an array of strings, suitable for JSON parsing:
    Examples:
    [
      "step 1",
      "step 2",
      "step 3",
      "step 4"
    ]

    goal: ${goal}
    `;

    const completion = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });
    const response = JSON.parse(completion.data.choices[0].message.content);
    return response;
  } catch (err) {
    console.error(err);
    return false;
  }
}
