import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";
import { encoding_for_model } from "@dqbd/tiktoken";

config();

const { OPENAI_API_KEY } = process.env;

const encoding = encoding_for_model("gpt-4");

export default async function (data, goal, answer, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    console.log(answer?.length, answer);
    const openai = new OpenAIApi(configuration);
    const prompt = ` 
    ${
      answer.length > 0
        ? `The Previous Answer was: ${answer} for the goal: ${goal}

    Since previous answer was provided, you can use the previous answer to complete the task: 
    continue with the previous answer with the task ${data}

    stick to the task and don't go off topic.
    Remember, you are a world-class software engineer and an expert in all programing languages,
    software systems, and architecture.`
        : `

    You are a world-class software engineer and an expert in all programing languages,
    software systems, and architecture.

    For reference, your high level goal is to ${goal}.
   and the Sub Task is: ${data}
  
    Provide no information about who you are and focus on writing code.
    Ensure code is bug and error free and explain complex concepts through comments
    Respond in well-formatted markdown. Ensure code blocks are used for code sections.
    Approach problems step by step and file by file, for each section, use a heading to describe the section.

    Write code to accomplish the following:
    ${goal} and the Sub Task is: ${data}
    `
    }`;

    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );

    const completion = await openai.createChatCompletion(
      {
        model: model,
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
