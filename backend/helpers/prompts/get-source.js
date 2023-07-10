import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (data, message, apiKey, model) {
  console.log("source bot");
  // to avoid medium.com links
  try {
    let links = data?.filter((item) => !item?.link?.includes("medium.com"));
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `You are a bot designed to assist developers in finding relevant websites that can answer their questions related to the Web3 or blockchain. You have been provided with the developer's message. In addition, you have access to information scraped from Google search results related to the developer's message
The scraped data is in JSON format includes three keys: "title", "link", and "content". The "title" key contains the title of the web page from which the data was extracted. The "link" key contains the URL of the web page. Finally, the "content" key contains relevant data extracted from the web page in Markdown format
message: ${message}
data: ${JSON.stringify(links)}

Your goal is to find the most relevant websites from the scraped data provided, and also include any relevant links found within the scraped content that may help the developer.
Your response should be in array format with each element link of the website.
You should convert the links from relative links to absolute links before adding them to the response.
Please only include hyperlinks from the provided data and refrain from creating any additional hyperlinks.
If the user asks a question that is not related to Web3 or blockchain, please respond with an empty array.
If the message you receive is not seeking advice, but rather something specific to you, such as a greeting or a question about your abilities, do not refer to the data and respond with an empty array.
The array should be sorted in descending order based on the relevance of the website to the developer's question. The most relevant website should be the first element in the array. 
You should prioritize keywords found in the link path and title, with the link itself being the most important factor. Following that, the algorithm should give weightage to keywords found in the hostname.
If you are unable to find any relevant websites, please respond with an empty array.
You should only add a maximum of 4 websites to the array.

Please note that you should not provide details about your code or process. Simply focus on returning the most helpful websites for the developer based on the available information.
Please avoid adding any additional information other than the array in the response, even if it is empty.
* RULES * 
Strictly follow the format of the response. Return only the array of suggested messages. it should be in the following format:
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
        // timeout after 15 seconds if the response is not ready
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
