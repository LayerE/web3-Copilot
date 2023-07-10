import { Configuration, OpenAIApi } from 'openai';
import { encoding_for_model } from '@dqbd/tiktoken';

import { User } from '../../models/index.js';

import { jsonrepair } from 'jsonrepair'
const encoding = encoding_for_model('gpt-4');
import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com"));
const zkevmWeb3 = new Web3(new Web3.providers.HttpProvider("https://rpc.public.zkevm-test.net"));
const mainnetWeb3 = new Web3(new Web3.providers.HttpProvider("https://polygon-rpc.com"));

export async function Faucet(message,data,apiKey,wallet,isAlreadyReceived) {
  try{
  const configuration = new Configuration({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });
  console.log(data);
  const openai = new OpenAIApi(configuration);
  const prompt = `
    You are a Polygon Faucet bot that sends tokens to the user based on the user message and data provided.
    you need to gather the information required to send the tokens like Network (Polygon Mumbai Testnet/Polygon zkEVM Testnet/Polygon Mainnet)
    if the user provides the wallet address then send the tokens to the wallet address else send the tokens to the site connected ${wallet} wallet.

    chat history: ${JSON.stringify(data?.slice(-10))}
    Use the chat history for reference only.

    Tokens that are already sent to the user: ${JSON.stringify(isAlreadyReceived)}
    if the token is already sent to the user then ask the user to wait for 24 hours to receive the tokens again. don't send the JSON response. just send the message "You have already received the tokens. Please wait for 24 hours to receive the tokens again." and end the conversation.

    IMPORTANT NOTE:
    * keep your tone friendly and helpful.
    * you don't need to ask the user to connect wallet or sign any message.
    * you don't need to navigate the user to any other website or tool to send the tokens.
    * you don't need to ask the user to install any dependencies to send the tokens.
    * User can get only 0.2 MATIC for Mumbai Testnet and 0.05 ETH for zkevm tokens and 0.01 MATIC for Mainnet tokens every 24 hours. 
    * you don't need to Greet (don't use Hi, Hello, Hey, etc. in the response) the user every time if chat history: ${data?.length} is greater than 0. 
    * my wallet means the wallet connected to the site ${wallet}.
    * User can't alter the amount
    VERY IMPORTANT NOTE:
    * don't send the JSON response if all the required is not provided like network, wallet by the user.
    * once you get the network and wallet address from the user then add JSON with backticks in markdown format to the response message and call the JSON as tx payload data.
      { "network": <network>, "wallet": <wallet>, "amount": <amount> } at the end of the message. don't any other text after the JSON.
    
    user message: ${message}
    Answer in markdown format:
  `
  console.log(
    'Total Tokens for completed prompt:',
    encoding.encode(prompt).length
);
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    stream: true,
            },
            { responseType: 'stream' }
  )
  return completion.data;
} catch (error) {
  console.log(error);
  return '';
}
}

export async function sendTokens(data,wallet) {
  try{
    console.log(data);
    let JSONData = JSON.parse(data)
    let network = JSONData?.network;
    let wallet = JSONData?.wallet;
    const account = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;

    if(network?.includes("zkEVM")){
      const nonce = await zkevmWeb3.eth.getTransactionCount(account);
      // send 0.2 Matic to the wallet
      const tx = {
        from: account,
        to: wallet,
        value: zkevmWeb3.utils.toHex(zkevmWeb3.utils.toWei('0.05', 'ether')),
        nonce: zkevmWeb3.utils.toHex(nonce),
        gas: 60000,
        gasPrice: zkevmWeb3.utils.toHex(zkevmWeb3.utils.toWei('10', 'gwei')),
      };
      const signedTx = await zkevmWeb3.eth.accounts.signTransaction(tx, privateKey);
      const sentTx = await zkevmWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(
        "Your transaction has been sent at address:",
        sentTx.transactionHash
      );
      await User.findOneAndUpdate({wallet: wallet}, {
        $set: {
          zkEVMFaucetTokenRefreshTime: new Date()
        }
      });
      return {
        message: `\n\n Successfully sent 0.05 zkEVM ETH to ${wallet} and transaction hash is: [${sentTx.transactionHash}](https://testnet-zkevm.polygonscan.com/tx/${sentTx.transactionHash})`,
        txHash: sentTx.transactionHash,
        success: true
      }
    }
    else if(network?.includes("Mumbai")){
    const nonce = await web3.eth.getTransactionCount(account);
    // send 0.2 Matic to the wallet
    const tx = {
      from: account,
      to: wallet,
      value: web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
      nonce: web3.utils.toHex(nonce),
      gas: 60000,
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(
      "Your transaction has been sent at address:",
      sentTx.transactionHash
    );
    await User.findOneAndUpdate({wallet: wallet}, {
      $set: {
        faucetTokenRefreshTime: new Date()
      }
    });
    return {
      message: `\n\n Successfully sent 0.2 MATIC to ${wallet} and transaction hash is: [${sentTx.transactionHash}](https://mumbai.polygonscan.com/tx/${sentTx.transactionHash})`,
      txHash: sentTx.transactionHash,
      success: true
    }
  } else if(network?.includes("Mainnet")){
    const nonce = await mainnetWeb3.eth.getTransactionCount(account);
      console.log(await mainnetWeb3.eth.getGasPrice())
      let gasPrice = await mainnetWeb3.eth.getGasPrice();
      console.log(gasPrice)
      const tx = {
        from: account,
        to: wallet,
        value: mainnetWeb3.utils.toHex(mainnetWeb3.utils.toWei('0.01', 'ether')),
        nonce: mainnetWeb3.utils.toHex(nonce),
        gas: 60000,
        gasPrice: mainnetWeb3.utils.toHex(gasPrice),
      };
      const signedTx = await mainnetWeb3.eth.accounts.signTransaction(tx, privateKey);
      const sentTx = await mainnetWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(
        "Your transaction has been sent at address:",
        sentTx.transactionHash
      );
      await User.findOneAndUpdate({wallet: wallet}, {
        $set: {
          mainnetFaucetTokenRefreshTime: new Date()
        }
      });
      return {
        message: `\n\n Successfully sent 0.01 Matic ETH to ${wallet} and transaction hash is: [${sentTx.transactionHash}](https://polygonscan.com/tx/${sentTx.transactionHash})`,
        txHash: sentTx.transactionHash,
        success: true
      }
    }
    else if(network?.includes("Mumbai")){
    const nonce = await web3.eth.getTransactionCount(account);
    // send 0.2 Matic to the wallet
    const tx = {
      from: account,
      to: wallet,
      value: web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
      nonce: web3.utils.toHex(nonce),
      gas: 60000,
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(
      "Your transaction has been sent at address:",
      sentTx.transactionHash
    );
    await User.findOneAndUpdate({wallet: wallet}, {
      $set: {
        faucetTokenRefreshTime: new Date()
      }
    });
    return {
      message: `\n\n Successfully sent 0.2 MATIC to ${wallet} and transaction hash is: [${sentTx.transactionHash}](https://mumbai.polygonscan.com/tx/${sentTx.transactionHash})`,
      txHash: sentTx.transactionHash,
      success: true
    }
   
  }
  }
  catch(error){
    console.log(error);
    return {error: error.message};
  }
}

export async function getAvailableTokens(data) {
  try{
    let availableTokens = [];
    if(data?.faucetTokenRefreshTime || data?.faucetTokenRefreshTime > new Date(Date.now() - 24 * 60 * 60 * 1000)){
       availableTokens.push("Polygon Mumbai Testnet");
    }
    if(data?.zkEVMFaucetTokenRefreshTime || data?.zkEVMFaucetTokenRefreshTime > new Date(Date.now() - 24 * 60 * 60 * 1000)){
      availableTokens.push("Polygon zkEVM Testnet");
    }
    if(data?.mainnetFaucetTokenRefreshTime || data?.mainnetFaucetTokenRefreshTime > new Date(Date.now() - 24 * 60 * 60 * 1000)){
      availableTokens.push("Polygon Mainnet");
    }
    return availableTokens;
  }
  catch(error){
    console.log(error);
    return {error: error.message};
  }
}