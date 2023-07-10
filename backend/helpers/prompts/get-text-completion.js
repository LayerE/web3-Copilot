import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';

config();
const { OPENAI_API_KEY } = process.env;
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function (req, res) {
    try {
        const { message, persona, history } = req.body;
        if (!message || !persona || !history) {
            return res.status(400).json({ message: 'Bad request' });
        }

        if (
            persona !== 'new_dev' &&
            persona !== 'dev' &&
            persona !== 'validator'
        ) {
            return res.status(400).json({ message: 'Invalid persona' });
        }
        console.log('Request data:', {
            message,
            persona,
            history,
        });

        const prompt = `
          As a text completion engine, your task is to predict exactly one message that a user is likely to type related to the topic related polygon blockchain. You are provided with a message fragment and a history of previous messages sent by the user listed in ascending order.
          Current message: ${message}
          Message history: ${history}
          
          Your goal is to complete the message fragment to generate a likely message that the user is going to type, based on the information in the message history. Please aim to complete the message fragment rather than rephrasing it. The guessed message should ideally be a single sentence and a question, but it can also be multiple sentences.
          In order to provide relevant and fresh content to the user, we need to generate a follow-up message rather than simply completing the message fragment.
          In the event that generating a follow-up message isn't possible or appropriate, please use your best judgment to determine the most relevant and concise output based on the current context.
          ${
              persona === 'new_dev' &&
              'Please keep in mind that the user is new developer with limited knowledge of polygon, and adjust your predicted messages or questions accordingly to provide helpful and informative responses'
          }
          ${
              persona === 'dev' &&
              'Please keep in mind that the user is an experienced developer and predict messages accordingly, using appropriate terminology and avoiding overly simplistic messages.'
          }
          ${
              persona === 'validator' &&
              'Please keep in mind that the user is a validator with limited knowledge of polygon who needs help on setting up a validator node, and adjust your predicted messages or questions accordingly to provide helpful and informative responses'
          }
          If there's no message fragment, generate a relevant message or question based on the current chat history.
          If no message history is provided, generate a relevant message or question based on the current message fragment.
          if no message fragment or message history is provided, generate a relevant message or question based on the experience and role of the user.
          
          
          For example:
          message: "Signature types supported"  
          history: [
                    "Implementing account abstraction on my Dapp",
                    "Benefits of using smart contracts as accounts",
                    "Key features of smart contract accounts"
           ]
          output: "Signature types supported by smart contract accounts"

          Please avoid providing details about your code or process and instead focus on generating the most probable message that the user is going to type based on the available information. Additionally, please refrain from appending "Current message:" or including anything other than the predicted message in your output.`;

        const completion = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
        });
        const predict = completion.data.choices[0].message.content;
        res.status(200).json({ message: predict });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
