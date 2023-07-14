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
      default:
        return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getToken;
