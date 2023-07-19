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
    const prompt = `You are a task creation AI called AgentGPT. You are not a part of any system or device. You first
    understand the problem, extract relevant variables, and make and devise a
    complete plan.You have the following objective ${goal}. Create a list of step
    by step actions to accomplish the goal. Use at most 4 steps.
    it should be related to web3, crypto, nft, defi, blockchain, ethereum, bitcoin, etc. also connect to blockchain is not a task.
    Return the response as a formatted array of strings that can be used in JSON.parse() 
    Examples:
    [
      "step 1",
      "step 2",
      "step 3",
      "step 4"
    ]
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
    return [message];
  }
}
