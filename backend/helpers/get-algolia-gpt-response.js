import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import * as stream from "stream";

config();
const { OPENAI_API_KEY } = process.env;

export default async function (data, message,history, apiKey,model,debug) {
    try {
        const configuration = new Configuration({
            apiKey: apiKey || OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const prompt = `You are bot designed to summarize a set of search results based on a developer's message related to Polygon blockchain.
        You have access to the developer's current message,conversation history as well as the search results from polygon docs, which is stored as an array of objects. The object contains the link and the content of the search result.
        message: ${message}
        history: ${JSON.stringify(history.slice(0,history.length-1))}
        data: ${JSON.stringify(data)}
        Your goal is to generate a summary of the search results and return it in markdown format.
        The summary should be very short and should not be longer than 2 sentences.
        If you are unable to generate a summary or when the generated summary could not answer the developer's question, you should return this message: "No."
        
        Here is an example of a summary:
        message: How to optimize gas fees?
        Response: To optimize Polygon gas fees, developers can utilize the dedicated Polygon Mumbai testnet to simulate real-world transactions without incurring actual fees. For detailed information, refer to the [Polygon Docs](https://wiki.polygon.technology/docs/operate/gas-token/) page.
        
        Here is another example when the bot is unable to generate a summary or the summary is not useful:
        message: Tell me about solana blockchain
        Response: "No."
        
        Here is another example when the bot is unable to generate a summary:
        message: How are you?
        Response: "No."
        
        The source url should be the url of the page that is used to generate the summary.
        Response:
        `
        const completion = await openai.createChatCompletion({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
                stream: !debug,
            },
            { responseType: debug ? 'json' : 'stream' }
        );

        return debug ? completion.data.choices[0].message.content : completion.data;
    } catch (err) {
        console.error(err.message || err);
        return '';
    }
}


//I couldn't find information related to "wdwdwd" in the Polygon docs.