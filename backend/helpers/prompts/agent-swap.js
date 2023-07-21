import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function (data, goal, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = ` 
    You are a Defi Swap Agent. you are provided with the data for the swap.
    ${JSON.stringify(data)}
    the goal is suggest the best swap for the user.
    `;

    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );

    const completion = await openai.createChatCompletion(
      {
        model:
          encoding.encode(prompt).length > 4000 ? "gpt-3.5-turbo-16k" : model,
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
  } catch (err) {
    console.log(err);
    return "";
  }
}
