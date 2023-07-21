import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (data, message, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `You are a bot designed to assist developers in finding relevant websites that can answer their questions related to the Web3 or blockchain. You have been provided with the developer's message. In addition, you have access to information scraped from Google search results related to the developer's message
The scraped data is in JSON format includes three keys: "title", "link", and "content". The "title" key contains the title of the web page from which the data was extracted. The "link" key contains the URL of the web page. Finally, the "content" key contains relevant data extracted from the web page in Markdown format
message: ${message}
data: ${JSON.stringify(data)}
Find the relevant links to the data and return the links in an array. The array should be in the following format:
["website#1", "website#2", "website#3"]
* RULES * 
Strictly follow the format of the response. Return only the array of suggested messages it should be JSON.parse(). it should be in the following format:
["website#1", "website#2", "website#3"]
`;
    const completion = await openai.createChatCompletion(
      {
        model: model,
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      },
      {
        timeout: 15000,
      }
    );
    console.log(completion.data.choices[0].message.content);
    return JSON.parse(completion.data.choices[0].message.content);
  } catch (err) {
    console.error(err);
    return [];
  }
}
