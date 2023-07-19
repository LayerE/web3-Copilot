import textversion from "textversionjs";
import { load } from "cheerio";

const selectedSites = [
  "https://portal.thirdweb.com/",
  "https://docs.alchemy.com/",
  "https://docs.infura.io/",
  "https://docs.chain.link/",
];
export default async function (url) {
  const urlFetch = await fetch(url);
  let htmlText = await urlFetch.text();

  if (selectedSites.includes(url)) {
    const $ = load(htmlText);
    $("footer").remove();
    $("header").remove();
    htmlText = $("main").html() || $("article").html();
  }

  const data = await textversion(htmlText, {
    linkProcess: (href, linkText) => linkText, // Ignore links
    imgProcess: () => "", // Ignore images
    ignoreHref: true, // Ignore link URLs
    ignoreImage: true, // Ignore image URLs
    keepNbsps: false, // Convert &nbsp; to spaces
    headingStyle: "underline", // Make headings underlined
    listStyle: "linebreak", // Indent lists
    useDefaultHtmlSanitizer: true, // Don't sanitize HTML
    listIndentionTabs: false, // Use spaces instead of tabs for indentation
    preserveIndentation: true, // Preserve indentation
    noLinkBrackets: true, // Remove brackets around links
    noAnchorUrl: true, // Remove anchor URLs
    ignoreHiddenElements: true, // Ignore hidden elements
  });
  return data?.slice(0, 5000);
}
