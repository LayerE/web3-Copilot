import axios from "axios";

const getDefiSwap = async (token1, token2, amount) => {
  try {
    if (amount.toString().length <= 2) {
      amount = amount * 10 ** 18;
    }
    const data = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${token1}&sellToken=${token2}&buyAmount=${amount}`,
      {
        headers: {
          "0x-api-key": "51056e05-3d60-4fce-a2ad-e78592c22295",
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default getDefiSwap;
