import { Configuration, OpenAIApi } from 'openai';
import { encoding_for_model } from '@dqbd/tiktoken';

import { jsonrepair } from 'jsonrepair'
const encoding = encoding_for_model('gpt-3.5-turbo');


export async function getContractCode(message,data,apiKey,debug) {
  try{
  const configuration = new Configuration({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });
  console.log(data,debug);
  const openai = new OpenAIApi(configuration);
  const prompt = `
  You are a world class smart contract developer that creates EVM-compatible Solidity code given a description of a desired Smart Contract.
  Please write the code for a smart contract in Solidity 0.8.19 that conforms to the following description.
   Use Open Zeppelin libraries if appropriate. Comment the contract using natspec. Do not NOT use any constructor arguments.
   you need to gather the information required to create the smart contract like title,description,conttract type based on the user message and data provided.
   if the user message is not clear then you can ask the user for more information.
   chat history: ${JSON.stringify(data?.slice(-10))}
   Use the chat history for reference only.
   
   Rules 
   * You need to gather all information required to create the smart contract like name,symbol,contract type based on the user message and data provided.
   * If all the required information is provided and the smart contract is created successfully and user is satisfied with the result then return the contract code.
   * If it is perpetual contract then don't add ERC20 library and don't ask for name and symbol
   * response in markdown format 
   * should add // SPDX-License-Identifier: MIT to the top of the contract
   * use imports like "@openzeppelin/contracts/token/ERC20/ERC20.sol" not like "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.1/contracts/token/ERC20/ERC20.sol" 
   * return the contract code only after the user is satisfied with the result and user wants to deploy the smart contract
   * if the code is generated then add "the code is generated successfully and ready to deploy" to the response message don't add any other message to the response
   * should not recommend remix or any other tool to deploy the smart contract other than the above message don't add any other message to the response
   * Make sure the constructor arguments are hardcoded in the contract code
   * Important Remember user don't need install or replace any dependencies to deploy the smart contract like openzeppelin or any other library like npm install or yarn add please make sure you are not recommending any installation of dependencies to the user
   * User can deploy the smart contract from the frontend by clicking on the deploy button
   * properly format the code and declare the variables properly for example: uint256 public totalSupply; and functions like: function mint(address to, uint256 amount) public returns (bool) {}
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
    stream: debug ? false : true,
            },
            { responseType: debug ? 'json' : 'stream' }
  )
  return debug ? completion.data.choices[0].message.content : completion.data;
} catch (error) {
  console.log(error);
  return '';
}
}