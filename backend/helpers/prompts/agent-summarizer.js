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
    Combine the following text into a cohesive document: 
    
    ${JSON.stringify(data)}
    
    Write using clear markdown formatting in a style expected of the goal ${goal}.
    Be as clear, informative, and descriptive as necessary.   
    Don't just say I don't have relevant data for this question. try to summarize the data according to the goal and task.
    If there is no information provided, say "There is nothing to summarize".  
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
