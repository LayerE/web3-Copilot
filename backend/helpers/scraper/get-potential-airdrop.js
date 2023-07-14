import textversionjs from "textversionjs";

import { load } from "cheerio";

const PotentialAirdrop = async (url) => {
  try {
    const fetchAirdrop = await fetch(url);
    const $ = load(await fetchAirdrop.text());
    const content = $("#content");
    const htmlText = content.html();
    const data = await textversionjs(htmlText);
    return data?.slice(0, 5000);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default PotentialAirdrop;
