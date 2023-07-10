import { config } from "dotenv";
import { load } from "cheerio";
import {
  polygonWikiParser,
  mediumWikiScraper,
  polygonBlogScrapper,
  polygonIdScrapper,
} from "./index.js";
import TurndownService from "turndown";
import { encoding_for_model } from "@dqbd/tiktoken";
import { redisClient } from "../config/database.js";

config();
const { GOOGLE_API_KEY, GOOGLE_CSE_KEY } = process.env;
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
const encoding = encoding_for_model("gpt-4");

export default async function (q) {
  console.log("Searching for", q);
  try {
    let response = await fetch(
      `https://www.googleapis.com/customsearch/v1/siterestrict?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_KEY}&q=${q}&safe=active`
    );

    response = await response.json();
    console.log("Google search response", response?.items?.length);

    // temp fix for polygon 2.0 wiki not being indexed by google
    let regex = /polygon\s2\.0|polygon\s2|polygon2\.0|polygon2/i;
    if (regex.test(q)) {
      console.log("Adding polygon 2.0 blog to search results");
      response.items.unshift({
        kind: "customsearch#result",
        title: "Introducing Polygon 2.0: The Value Layer of the Internet",
        link: "https://polygon.technology/blog/introducing-polygon-2-0-the-value-layer-of-the-internet",
        htmlTitle:
          "Introducing <b>Polygon</b> 2.0: The Value Layer of the Internet",
        htmlSnippet:
          "Introducing <b>Polygon</b> 2.0: The Value Layer of the Internet",
      });
      response.items.unshift({
        kind: "customsearch#result",
        title: "Polygon 2.0: Polygon PoS & ZK Layer 2",
        link: "https://polygon.technology/blog/polygon-2-0-polygon-pos-zk-layer-2",
        htmlTitle: "Polygon 2.0: Polygon PoS & ZK Layer 2",
        htmlSnippet: "Polygon 2.0: Polygon PoS & ZK Layer 2",
      });
    }

    response =
      response.items &&
      response.items.map(({ title, link }) => {
        return new Promise(async (resolve) => {
          console.log("Searching for", title, link);
          try {
            //Fix since polygon wiki is not correctly indexed by google & Polygon for some reason do not follow the same structure
            link = link.replace(
              "wiki.polygon.technology/docs/zkEVM/",
              "zkevm.polygon.technology/docs/"
            );
            link = link.replace("zknode/setup-local-node", "setup-local-node");
            link = link.replace(
              "zknode/setup-production-node",
              "setup-production-node"
            );
            let markdown = "";
            try {
              markdown = await redisClient.get(link);
              // console.log(`Fetched ${link} from cache`);
            } catch (e) {
              console.log(e);
              console.log(`Fetching ${link} from cache failed.`);
            }

            if (!markdown) {
              let response = await fetch(link);
              if (!response.ok) {
                resolve(null);
              }
              response = await response.text();
              let $ = load(response);

              if (
                link.includes("zkevm.polygon.technology") ||
                link.includes("wiki.polygon.technology")
              )
                $ = polygonWikiParser($);

              if (link.includes("polygon.technology/blog")) {
                $ = polygonBlogScrapper($);
              }

              if (link.includes("medium.com")) {
                $ = mediumWikiScraper($);
              }

              if (link.includes("0xpolygonid.github.io/tutorials")) {
                $ = polygonIdScrapper($);
              }

              $.find(
                "img, video, iframe, audio, source, figure, figcaption, noscript"
              ).remove();

              markdown = turndownService.turndown($.html());
              console.log("Scraping site data");

              console.log("Scraping site data");
              const siteData = await getSiteData(link);
              markdown = siteData;
              console.log("Scraping site data done", siteData?.length);

              try {
                await redisClient.set(link, markdown, {
                  EX: 60 * 60 * 24,
                });
                console.log(`Cached ${link} for 24 hours`);
              } catch (e) {
                console.log(e);
                console.log("Caching scraped data failed.");
              }
            }

            // const markdown = $.text(); // Reduces Token noticeably. But not good for formatting & Removes links.
            const tokens = encoding.encode(markdown).length;
            console.log(link, `Tokens: ${tokens}`);
            resolve({
              title,
              link,
              content: markdown,
              tokens,
            });
          } catch (e) {
            console.log(link);
            console.log(e);
            resolve(null);
          }
        });
      });

    response = response || [];

    console.log(`Extracting data for "${q}" using google search`);
    return await Promise.all(response);
  } catch (e) {
    console.log(e);
    return [];
  }
}
