import textversion from "textversionjs";

export default async function ($) {
  console.log("Scraping site data");
  const data = await textversion($);
  return data;
}
