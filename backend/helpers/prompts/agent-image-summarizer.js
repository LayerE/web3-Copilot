import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function ImageGenSummarizer(data, goal, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = ` 
    Here is the Image you've requested for the task
    ${JSON.stringify(data)}
    return as image, don't describe the image or process, just answer the question.
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
  } catch (err) {
    console.log(err);
    return "";
  }
}
