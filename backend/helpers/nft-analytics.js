import { getNFTRoute } from "./index.js";
import axios from "axios";

//URL SHOULD BE REMOVED LATER
const getNFTAnalytics = async (
  message,
  walletAddress,
  apiKey,
  url,
  disableRoute = false
) => {
  try {
    const response = disableRoute
      ? message
      : await getNFTRoute(message, walletAddress, apiKey);
    console.log(response);
    let Routes;
    try {
      Routes = JSON.parse(response);
    } catch (error) {
      Routes = response;
    }
    console.log(Routes);
    if (Array.isArray(Routes)) {
      let routes = Routes;
      let dataJSON = [];
      let duration = "24hours";
      for (let i = 0; i < routes.length; i++) {
        const dataFetch = await axios.get(
          `https://nftsurfaceboard.up.railway.app/v1` + routes[i]
        );
        let data = dataFetch?.data?.data
          ? dataFetch?.data?.data
          : dataFetch?.data;
        if (routes[i].includes("/marketOverview/mean")) {
          data.type = "matic/polygin prices";
          data.format = "USD";
        }
        if (url === "/stats/raw")
          dataJSON.push({
            route: routes[i],
            data,
            absoluteRoute: `https://nftsurfaceboard.up.railway.app/v1/${routes[i]}`,
          });
        else dataJSON.push(data);
      }
      console.log(dataJSON);
      return { dataJSON, duration };
    } else {
      if (Routes?.includes("false") || Routes?.includes("FALSE"))
        return {
          dataJSON: "false",
          duration: "false",
        };
      const dataFetch = await axios.get(
        `https://nftsurfaceboard.up.railway.app/v1` + Routes
      );
      let duration = dataFetch?.data?.duration
        ? dataFetch?.data?.duration
        : "24hours";
      console.log(duration);
      let dataJSON = dataFetch?.data?.data
        ? dataFetch?.data?.data
        : dataFetch?.data;
      if (response?.includes("/marketOverview/mean")) {
        dataJSON.type = "matic/polygin prices";
        dataJSON.format = "USD";
      }
      return { dataJSON, duration };
    }
  } catch (error) {
    console.log(error);
    return { dataJSON: "false", duration: "false" };
  }
};

const getWalletAnalytics = async (message, walletAddress, type) => {
  try {
    // remove ' or " from walletAddress
    walletAddress = walletAddress?.replace(/['"]+/g, "") || walletAddress;
    if (!walletAddress) return { dataJSON: "false", duration: "false" };
    switch (type) {
      case "wallet_transactions":
        const dataFetch = await axios.get(
          `https://nftsurfaceboard.up.railway.app/v1/wallet/insights/${walletAddress}?type=transactions&chain=eth`
        );
        let duration = dataFetch?.data?.duration
          ? dataFetch?.data?.duration
          : "24hours";
        let dataJSON = dataFetch?.data?.data
          ? dataFetch?.data?.data
          : dataFetch?.data;
        return { dataJSON, duration };
      case "wallet_nfts": {
        const dataFetch = await axios.get(
          `https://nftsurfaceboard.up.railway.app/v1/wallet/insights/${walletAddress}?type=nfts&chain=eth`
        );
        let duration = dataFetch?.data?.duration
          ? dataFetch?.data?.duration
          : "24hours";
        const response = await axios.get(
          "https://webapi.nftscan.com/nftscan/getProfileHoldNftOverview",
          {
            params: {
              userAddress: walletAddress,
              queryType: "volume",
            },
            headers: {
              authority: "webapi.nftscan.com",
              accept: "application/json, text/plain, */*",
              "accept-language": "en-GB,en;q=0.9",
              chain: "ETH",
              origin: "https://portfolio.nftscan.com",
              referer: "https://portfolio.nftscan.com/",
              "sec-ch-ua":
                '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
              "sec-ch-ua-mobile": "?1",
              "sec-ch-ua-platform": '"Android"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "user-agent":
                "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
            },
          }
        );
        let profileHoldOverview = response?.data?.data;
        let dataJSON = dataFetch?.data?.data
          ? dataFetch?.data?.data
          : dataFetch?.data;
        return { dataJSON, duration, profileHoldOverview };
      }
      case "wallet_balance": {
        const dataFetch = await axios.get(
          `https://nftsurfaceboard.up.railway.app/v1/wallet/insights/${walletAddress}?type=balance&chain=eth`
        );
        let duration = dataFetch?.data?.duration
          ? dataFetch?.data?.duration
          : "24hours";
        let dataJSON = dataFetch?.data?.data
          ? dataFetch?.data?.data
          : dataFetch?.data;
        return { dataJSON, duration };
      }
      default:
        return { dataJSON: "false", duration: "false" };
    }
  } catch (error) {
    console.log(error);
    return { dataJSON: "false", duration: "false" };
  }
};
export { getNFTAnalytics, getWalletAnalytics };
