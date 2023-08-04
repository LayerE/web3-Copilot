const tools = [
  {
    toolName: "Search",
    name: "Search",
    description: "Search for a query on Google",
    args: "query for search related to web3, web3 projects, crypto, nft, defi, blockchain, ethereum, bitcoin, etc.",
  },
  {
    toolName: "Wallet Insights",
    name: "wallet_transactions",
    description:
      "Get wallet-level data containing recent ERC20 Transactions not NFTs",
    args: "wallet address or ENS name",
  },
  {
    toolName: "Wallet Insights",
    name: "wallet_nfts",
    description: "Get wallet-level data containing NFTs owned by the wallet",
    args: "wallet address or ENS name",
  },
  {
    toolName: "Wallet Insights",
    name: "wallet_balance",
    description:
      "Get wallet-level data containing balance (total worth) it returns overall info about the wallet",
    args: "wallet address or ENS name",
  },
  {
    toolName: "NFT Insights",
    name: "Specific_NFT_Info",
    description:
      "Get NFT Level Data like trades, floor price, etc for a specific NFT collection",
    args: "collection name",
  },
  {
    toolName: "Defi",
    name: "Defi_Insights",
    description: "Get Defi data like top yield pools, top defi projects, etc.",
    args: "add the type that should be in chainTVL or tvl or dexVolume or yieldPools or gasPrice",
  },
  {
    toolName: "NFT Insights",
    name: "top_nfts_collections",
    description: "Get Top NFTs Collections from all blockchains",
    args: "none",
  },
  {
    toolName: "NFT Insights",
    name: "top_eth_collections",
    description: "Get Top NFTs Collections on Ethereum",
    args: "none",
  },
  {
    toolName: "NFT Insights",
    name: "top_eth_nft_sales",
    description: "Get Top NFTs Sales on Ethereum",
    args: "none",
  },
  {
    toolName: "NFT Insights",
    name: "top_polygon_collections",
    description: "Get Top NFTs Collections on Polygon/Matic",
    args: "none",
  },
  {
    toolName: "Defi",
    name: "dappRadar",
    description:
      "Get top dapps by volume, users, and transactions on Ethereum and Polygon for staking, gaming, defi, etc.",
    args: "none",
  },
  {
    toolName: "Code",
    name: "code",
    description: "Helps you write code or debug code",
    args: "none",
  },
  {
    toolName: "Image",
    name: "image_gen",
    description: "Used to sketch, draw, or generate an image.",
    args: "The input prompt to the image generator.This should be a detailed description of the image touching on image style, image focus, color, etc.",
  },
  {
    toolName: "Defi",
    name: "defi_swap",
    description:
      "Get the quote for swapping tokens (e.g. ETH to DAI) the token names are case sensitive",
    args: "token1, token2, amount",
  },
  {
    toolName: "Airdrops",
    name: "potential_airdrops",
    description: "Get information about potential airdrops",
    args: "none",
  },
  {
    toolName: "Airdrops",
    name: "latest_airdrops",
    description: "Get information about latest airdrops",
    args: "none",
  },
  {
    toolName: "Airdrops",
    name: "hottest_airdrops",
    description: "Get information about hottest airdrops",
    args: "none",
  },
  {
    toolName: "Tokens",
    name: "token_insights",
    description:
      "It is used to get the Token Price at the moment like matic, eth, etc.",
    args: "none",
  },
  {
    toolName: "Tokens",
    name: "token_listings",
    description:
      "It is used to get the Token Listings which includes market cap, price, volume, etc.",
    args: "none",
  },
];

export { tools };
