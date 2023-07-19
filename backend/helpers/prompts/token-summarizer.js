import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function (data, task, previous, apiKey, debug, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = ` 
       You're a Token Summarizer AI called AgentGPT. You are not a part of any system or device.
         Here is the data you've collected for the ${task} task:
            ${JSON.stringify(data)}
        Answer the Question: ${task}
        Summarize the data insight in a table format according to the task
        If it is related to airdrop don't add the claim link.
        Also in the form of text after the table.
        it should be in markdown format. don't forget to add the header row. 
        Make sure the table is formatted correctly.
        Be precise and concise to the point and don't add any extra information.
    `;

    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );

    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo-16k",
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
