import { Configuration, OpenAIApi } from "openai";
import { encoding_for_model } from "@dqbd/tiktoken";

const encoding = encoding_for_model("gpt-4");

export async function getNFTRoute(message, walletAddress, apiKey) {
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
      - /wallet/insights/{walletAddressOrENS}?type={balance or transactions or nfts}
        Summary: For wallet-level data containing balance (total worth), recent transactions, and NFTs owned by the wallet. Replace {walletAddress or ens} with the wallet address or ENS name. Use ${walletAddress} if walletAddress/ENS is not available
        params: {walletAddressOrENS} (wallet address or ENS name, use ${walletAddress} if walletAddress/ENS is not available in the message data)
        query: {type} (balance, transactions, nfts)
      - /collection/{collectionName}?sortBy={sortBy}&type={type}
        Summary: For collection-level data and last 7 days of specific collection volume. Replace {collectionName} with the collection name or contract address. Contains floor, sales, sales count, volume, price, listing data, and top sales and nft listings of specific collection.
        parameter: {collectionName} (collection name or contract address) {sortBy} (sort by asc or desc for the token price) {type} (general or sales or listings or volume)
      - /defi?type={type} 
        Summary: For DeFi-related data such as TVL, chain TVL, dexs volume,yield pools and gas price. Replace {type} with 'chainTVL','tvl','dexVolume','yieldPools' or 'gasPrice' based on the query.
        query params: type (chainTVL, tvl, dexVolume,yieldPools,gasPrice)
      - /topCollection?duration={duration}&limit={limit}&sortBy={sortBy}
          Summary: Get top NFT collections by various metrics set default duration to 3 and limit to 5 
          query params: duration, limit, sortBy, category. Duration: 1-1hr, 2-6hr, 3-12hrs, 4-1 day, 5-1 week, 6-1 month. Limit: Maximum number of collections to return (max: 25). SortBy: Options: volume_usd, sales, sales_count. Category: Default is "All". Other options include "PFP", "Brands", "Gaming", "Utility", "Art".
      - /topCollectionBySales?duration={duration}
          Summary: Get top NFT collections by sales (1 day, 7 days)
          query params: duration (Duration for which to retrieve data. 0 - 1 day, 1 - 7 days)
      - /topCollectionByVolume?duration={duration}
          Summary: Get top NFT collections by volume (1 day, 7 days)
          query params: duration (Duration for which to retrieve data. 0 - 1 day, 1 - 7 days)
      - /topCollectionByTrend?duration={duration}
          Summary: Get top NFT collections that is trending or popular based on sales count (1 day, 7 days)
          query params: duration (Duration for which to retrieve data. 0 - 1 day, 1 - 7 days)
      - /marketOverview/mean
          Summary: Get Polygon/Matic Price (contains mean,median,current price,24hr change in USD and %)
      - /marketOverview/uniqueNFTOwners
          Summary: Get Number of unique NFT owners on Polygon/Matic
      - /marketOverview/dailynewwallets
          Summary: Get Number of new wallets created on Polygon/Matic daily
      - /marketOverview/totalNFTSalesVolume
          Summary: Get Total NFT Sales Volume on Polygon/Matic (Cummalative Volume)
      - /marketOverview/totalNFTCollections
          Summary: Get Total NFT Collections count on Polygon/Matic
      - /marketOverview/totalNFTMarketCap
          Summary: Get Total NFT Market Cap on Polygon/Matic
      if it matches for more than one route then return the route in an array.
      ex: if the message is "what is the price of matic and gas price" then return ["/marketOverview/mean","/defi?type=gasPrice"] in JSON format.
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

export async function getDataExplain(message, data, duration, apiKey, model) {
  try {
    const configuration = new Configuration({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `
  you are Polygon Analytics bot.you are only meant to explain the data, not the formatting.
  JSON data is the output of the surfaceboard.xyz API for the following query: ${message}
  '''json
  ${JSON.stringify(data)}
  '''
  only consider USD for all data, ignore all irrelevant data 
  Important Rule: if the query is related to chepeast/highest nft or listing data, add the link to market_link to buy the nft and transaction link if it is available and most importantly add NFT image to the table as the first column and list 5 nfts from the data if available as Table format.
  if the data is "false" then return "sorry couldn't fetch any relevant data"
  if the data contains only one value then return that value.limit the data to 10 values only.
  if the query is related to gas price/fee ensure that the data is in gwei and it is for Polygon/Matic chain and not USD or any other currency.
  if it contains contractAddress, return only collection name and ignore other data such as supply,owners,contractAddress etc and consider only volume USD if it is available.
  if it contains tokenID then return only tokenID,collection/name and ignore other data and consider price if it is available.
  if the data contains an array of values then try to convert it as markdown table and return it.
  Don't describe the code or process, just answer the question.
  Only for Collections/NFT queries Add the duration to the data and mention it somewhere in the answer if it is available either using ${message} or data or if it is not available then use ${duration}
  Using the output above as your data source, answer the question in markdown format
  Make sure to explain the data in markdown ${message} using the data above.
  `;
    console.log(
      "Total Tokens for completed prompt:",
      encoding.encode(prompt).length
    );
    const completion = await openai.createChatCompletion(
      {
        model: model || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        stream: true,
      },
      {
        responseType: "stream",
      }
    );
    return completion.data;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}
