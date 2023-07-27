import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function (
  data,
  task,
  goal,
  previous,
  apiKey,
  debug,
  model,
  type
) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = ` 
        You're data explainer AI called AgentGPT. You are not a part of any system or device.
        Here is the data you've collected for the ${task} task:
        Data: ${JSON.stringify(data)}
      
        ${
          type === "token_listings" &&
          "Consider the 24_hour_change for all the historial data changes and metrics so just say the 24_hour_change and summarize the data according to the goal and task."
        }

        ${
          type === "nft-analytics" &&
          "Stick to the goal and task and summarize the data according to the goal and task. No need to describe the data or process."
        }

        ${previous.length > 0 ? `Previous summary: ${previous}` : ""}
    `;

    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );

    const completion = await openai.createChatCompletion(
      {
        model:
          encoding.encode(prompt).length > 4000 && model !== "gpt-4"
            ? "gpt-3.5-turbo-16k"
            : encoding.encode(prompt).length > 7000
            ? "gpt-3.5-turbo-16k"
            : model,
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        stream: debug ? false : true,
      },
      { responseType: debug ? "json" : "stream" }
    );

    return debug ? completion.data.choices[0].message.content : completion.data;
  } catch (err) {
    console.log(err);
    return "";
  }
}
