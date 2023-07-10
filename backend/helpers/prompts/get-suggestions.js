import { Configuration, OpenAIApi } from "openai";
import { config } from "dotenv";

import { jsonrepair } from "jsonrepair";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (history, answer, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    // little hack to make sure the prompt is not too long and reduce the time it takes to generate the response
    answer = answer.substring(0, 100);
    const prompt = `
          As an engine for suggesting follow-up messages, your task is to provide the user with three messages in an array format that are exclusively relevant to the topic related to "web3" or "blockchain" and its associated subjects. The user's message history, listed in ascending order, and the answer for the last message sent by the user in markdown format are provided for your reference.
          
          Message history: ${history}
          Answer to the last question in markdown format: ${answer}
          Make Sure the suggested messages are relevant to the topic related to "Web3 or blockchain" and its associated subjects. 
          It's very important that the suggested messages doesn't include any previous messages avoid suggesting messages that are too similar to each other. For example, if the first message is "How to create NFT?", the second message shouldn't be "How to create NFT on polygon?" since it is same as the first message but with the addition of "polygon". Instead, the second message should be something like "Explain ERC721 token standard".
          The suggested messages should ideally be a single sentence and a question, but it can also be multiple sentences. 
          Please keep in mind that the suggested messages work best when they are closely related to the context and could serve as a near-perfect follow-up message.
          In the event that generating suggested messages isn't possible or appropriate, please use your best judgment to determine the most relevant and concise output based on the current context.    
          In the event that you couldn't generate any suggested messages, please return an empty array.      
          Answer to the last question in markdown format: "Answer to the last message (message#4)"
          output: [
          "Most similar suggested follow-up message"
          "Second most similar suggested follow-up message"",
          "Third most similar suggested follow-up message"
          ]
          For example:
          Message history: [
                    "message#1",
                    "message#2",
                    "message#3"",
                    "message#4",
           ]
       
          
          Please note that you should not provide details about your code or process. Simply focus on generating the most suggestive messages for the user based on the available information.
          Please avoid adding any additional information other than the array in the response, even if it is empty.
          Return Empty array if you are unable to generate any suggested messages.
          * RULES * 
          Strictly follow the format of the response. Return only the array of suggested messages. it should be in the following format:
          ["message#1", "message#2", "message#3"]
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
  } catch (error) {
    console.log(error);
    return [];
  }
}
