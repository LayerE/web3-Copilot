import TurndownService from "turndown";
const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
  preformattedCode: false,
});
import { redisClient } from "../../config/database.js";

export default async function (query) {
  let category,
    data = null;
  if (query.includes("general")) {
    category = "general";
  } else if (query.includes("games")) {
    category = "games";
  } else if (query.includes("defi")) {
    category = "defi";
  } else if (query.includes("gambling")) {
    category = "gambling";
  } else if (query.includes("exchanges")) {
    category = "exchanges";
  } else if (query.includes("collectibles")) {
    category = "collectibles";
  } else if (query.includes("marketplaces")) {
    category = "marketplaces";
  } else if (query.includes("social")) {
    category = "social";
  } else if (query.includes("other")) {
    category = "other";
  } else if (query.includes("high-risk")) {
    category = "high-risk";
  } else {
    category = "general";
  }

  try {
    data = await redisClient.get(category);
    console.log(`Fetched ${category} dapps details from cache`);
  } catch (e) {
    console.log(e);
    console.log(`Fetching ${category} dapps details from cache failed.`);
  }

  if (data)
    try {
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
    }

  try {
    data = await fetch(
      `https://api.dappradar.com/on-demand/dapps/top/uaw?chain=polygon&top=10${
        category !== "general" ? `&category=${category}` : ""
      }`,
      {
        headers: {
          "X-BLOBR-KEY": "BnJhqnpIDcDb5d9PkNhJOit8cT7aiDb3",
        },
      }
    );
    data = await data.json();
    data = data?.results?.map(({ name, fullDescription, website, metrics }) => {
      let markdown = turndownService.turndown(fullDescription);
      const metric = `Dapp metrics: \n\n - Unique users: ${
        metrics?.uaw ?? 0
      } \n - Volume: ${metrics?.volume ?? 0} \n - Transactions: ${
        metrics?.transactions ?? 0
      } \n - Balance: ${metrics?.balance ?? 0} `;
      markdown = markdown + "\n\n" + metric;
      console.log(markdown);
      return {
        title: name,
        content: markdown,
        link: website,
      };
    });

    if (!data) {
      data = [];
    } else {
      try {
        await redisClient.set(category, JSON.stringify(data), {
          EX: 60 * 60,
        });
        console.log(`Cached ${category} dapps details for 1 hours`);
      } catch (e) {
        console.log(e);
        console.log("Caching ${category} dapps details failed.");
      }
    }
  } catch (error) {
    data = [];
  }

  return data;
}
