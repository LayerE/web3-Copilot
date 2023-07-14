import axios from "axios";

const getToken = async (type) => {
  try {
    switch (type) {
      case "airdrop":
        const fetchAirdrop = await axios.get(
          "https://api.airdropking.io/airdrops/?order=value"
        );
        return fetchAirdrop.data;
      case "token_insights":
        const fetchToken = await axios.get(
          "https://nftsurfaceboard.up.railway.app/v1/coinmarket/price"
        );
        return fetchToken.data;
      case "listings":
        const fetchListings = await axios.get(
          "https://nftsurfaceboard.up.railway.app/v1/coinmarket/listings"
        );
        return fetchListings.data;
      case "gas":
        try {
          let chains = ["eth", "polygon", "avax", "arb", "opt"];
          let gasPrice = {};
          for (let i = 0; i < chains.length; i++) {
            const chain = chains[i];
            const response = await axios.get(
              `https://api.owlracle.info/v4/${chain}/gas?apikey=487cef405c174e2f947bbe0c17f054dc&feeinusd=true`
            );
            gasPrice[chain] = {
              gasFee: response?.data?.speeds[1]?.maxFeePerGas,
              gasFeeInUSD: response?.data?.speeds[1]?.estimatedFee,
            };
          }
          return gasPrice;
        } catch (error) {
          console.log(error);
          return false;
        }
      default:
        return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getToken;
