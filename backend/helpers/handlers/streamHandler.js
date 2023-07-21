import {
  getSource,
  getSuggestions,
  recordAnalyticsAndWriteConversation,
} from "../index.js";
import { sendData } from "../../utils/index.js";

/* @desc    Stream handler for OpenAI API
 * @param   {Object} res - response object
 * @param   {Object} chat - chat object
 * @param   {String} id - user id
 * @param   {String} conversationId - conversation id
 * @param   {String} type - type of request
 * @param   {String} message - user message
 * @param   {Object} data - scraped data
 * @param   {Array} history - user history
 * @param   {String} persona - persona
 * @param   {String} apiKey - api key
 * @param   {String} model - model
 * @param   {Boolean} isRegenerated - is regenerated
 * @param   {Boolean} isFooter - is footer enabled
 * @param   {String} wallet - wallet address
 * @param   {Boolean} isMint - to handle mint controller
 * @return  {Promise} - stream data
 */
export async function streamHandler(
  res,
  chat,
  id,
  conversationId,
  type,
  message,
  data,
  history,
  persona,
  apiKey,
  model,
  isRegenerated,
  isFooter,
  wallet,
  isMint = false
) {
  let answer = "";
  chat.on("data", (chunk) => {
    const lines = chunk
      .toString()
      .split("\n")
      .filter((line) => line.trim() !== "");

    for (const line of lines) {
      const mes = line.replace(/^data: /, "");
      if (mes === "[DONE]") {
        console.log("Answer generated. Getting source links and suggestions");
        sendData({ completed: true }, res);
        Promise.all([
          isFooter === "false" || isMint
            ? ([], [])
            : (type === "web" && isFooter !== "false" && type !== "contract"
                ? getSource(data, message, apiKey ?? false, model)
                : type === "dapp-radar"
                ? ["https://dappradar.com/"]
                : [],
              type !== "personal" && isFooter !== "false" && type !== "contract"
                ? getSuggestions(
                    history,
                    answer,
                    apiKey ?? false,
                    "gpt-3.5-turbo"
                  )
                : []),
        ]).then(async ([source, suggestions]) => {
          if (isMint) {
            let json = false;
            if (answer?.includes("```")) {
              json = answer?.match(/```([^]*)```/)[1];
              if (json.startsWith("json")) {
                json = json.replace("json", "");
              }
              console.log(json);
            }
            sendData("", res);
            res.write(
              `data: ${JSON.stringify({
                source: [],
                suggestions: [],
                id,
                conversationId,
                showButton: json ? true : false,
                sourceCode: json ? json : false,
              })}\n\n`
            );
          } else {
            let code = false;
            if (type === "contract" && answer?.includes("```")) {
              code = answer?.match(/```([^]*)```/)[1];
              console.log(code);
            }
            res.write(
              `data: ${JSON.stringify({
                source,
                suggestions,
                id,
                conversationId,
                showButton:
                  type === "contract" && answer?.includes("```") ? true : false,
                sourceCode: code ? code : false,
              })}\n\n`
            );
          }
          res.end();
          await recordAnalyticsAndWriteConversation(
            id,
            wallet,
            message,
            answer,
            apiKey,
            model,
            conversationId,
            persona,
            isRegenerated,
            isFooter,
            type
          );
          console.log("Request completed");
        });
      } else {
        try {
          const parsed = JSON?.parse(mes);
          const content = parsed.choices[0].delta.content;
          if (content) {
            sendData(content, res);
            answer += content;
          }
        } catch (err) {
          console.log("Error parsing JSON");
        }
      }
    }
  });
}
