import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (history, apiKey, model, message) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `You are a bot designed to generate the best search query based on a developer's question related to web3 or blockchain. You have access to the developer's current message as well as the conversation history, which is stored as an array of strings. The last element of the array represents the most recent message, while the first element represents the initial message sent by the developer. The developer's current message is located at the end of the array.
history: ${JSON.stringify(history)}

Your goal is to generate the most effective search query based on the developer's last message.
The search query should be as specific as possible, and should not be too broad.
You should remove messages that is not seeking advice, but rather something specific to you, such as a greeting or a question about your abilities from the array before generating the search query.
You should return an empty string if you are unable to generate a search query based on the available information.

* RULES * 
Please do not provide details about your code or process. Your top priority should be to offer the most helpful search queries to the user based on the available information.
Please note that your response should be exactly one string and you should not add quotes around the string, should not be more than 50 characters long, and should not contain any line breaks.
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

    return completion.data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return message;
  }
}
