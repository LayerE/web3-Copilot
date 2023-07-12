import { Configuration, OpenAIApi } from "openai";
import { encoding_for_model } from "@dqbd/tiktoken";

const encoding = encoding_for_model("gpt-4");

export async function getCoinMarketRoutes(message, walletAddress, apiKey) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `
      You are the API Suggestion bot. Please note the following limitations:
      Limitations:
      - You can only use the API routes provided in the data section.
      - You must return only the route, not the whole URL. Add appropriate parameters to the route if needed (e.g. /topCollection?duration=3&limit=25, /collection/y00ts, /wallet/insights/0x4a935d54133705ac265eba21a2cA20D520E8c438?type=balance).
      - If a route is not suitable for the query, you must return "false" without explanation.
      Routes:
        - /v1/cryptocurrency/airdrops (GET)
            summary: Get a list of cryptocurrency airdrop events
        -
      Please only return the route. If the prompt asks for a format such as markdown or a simple string, ignore it. You are only meant to provide the information, not the formatting.
      ${message}

      *Strictly follow the format of the response.*
      ["routes"]
      `;
    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

// export async function getDataExplain(message, data, duration, apiKey, model) {
//   try {
//     const configuration = new Configuration({
//       apiKey: apiKey || process.env.OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);
//     const prompt = `
//   you are Polygon Analytics bot.you are only meant to explain the data, not the formatting.
//   JSON data is the output of the surfaceboard.xyz API for the following query: ${message}
//   '''json
//   ${JSON.stringify(data)}
//   '''
//   only consider USD for all data, ignore all irrelevant data
//   Important Rule: if the query is related to chepeast/highest nft or listing data, add the link to market_link to buy the nft and transaction link if it is available and most importantly add NFT image to the table as the first column and list 5 nfts from the data if available as Table format.
//   if the data is "false" then return "sorry couldn't fetch any relevant data"
//   if the data contains only one value then return that value.limit the data to 10 values only.
//   if the query is related to gas price/fee ensure that the data is in gwei and it is for Polygon/Matic chain and not USD or any other currency.
//   if it contains contractAddress, return only collection name and ignore other data such as supply,owners,contractAddress etc and consider only volume USD if it is available.
//   if it contains tokenID then return only tokenID,collection/name and ignore other data and consider price if it is available.
//   if the data contains an array of values then try to convert it as markdown table and return it.
//   Don't describe the code or process, just answer the question.
//   Only for Collections/NFT queries Add the duration to the data and mention it somewhere in the answer if it is available either using ${message} or data or if it is not available then use ${duration}
//   Using the output above as your data source, answer the question in markdown format
//   Make sure to explain the data in markdown ${message} using the data above.
//   `;
//     console.log(
//       "Total Tokens for completed prompt:",
//       encoding.encode(prompt).length
//     );
//     const completion = await openai.createChatCompletion(
//       {
//         model: model || "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: prompt,
//           },
//         ],
//         stream: true,
//       },
//       {
//         responseType: "stream",
//       }
//     );
//     return completion.data;
//   } catch (error) {
//     console.log(error);
//     return { error: error.message };
//   }
// }
