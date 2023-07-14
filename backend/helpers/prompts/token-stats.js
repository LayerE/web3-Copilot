import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (goal, apiKey, model) {
  const tools = [
    {
      name: "airdrop",
      description: "Get airdrop information",
      args: "none",
    },
    {
      name: "token_insights",
      description: "Get Token Prices",
      args: "none",
    },
  ];

  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `High level objective: ${goal}
    
    Based on this information, use the best function to make progress or accomplish the task entirely.
    Select the correct function by being smart and efficient. Ensure "reasoning" and only "reasoning" is used to select the function.
    
    Note you MUST select a function.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      functions: tools?.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
          type: "object",
          properties: {
            reasoning: {
              type: "string",
              description: "Reasoning for why this tool is the best choice.",
            },
            arg: {
              type: "string",
              description: tool.args,
            },
          },
          required: ["reasoning", "arg"],
        },
      })),
      function_call: "auto",
    });
    let args = completion.data.choices[0].message.function_call;

    return {
      tool: args?.name,
      args: JSON.parse(args?.arguments),
    };
  } catch (err) {
    console.error(err);
    return false;
  }
}
