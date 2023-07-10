import Web3 from "web3";


const web3 = new Web3(new Web3.providers.HttpProvider("https://matic-mumbai.chainstacklabs.com"));

const deployContract = async (contract,abi) => {

    try{
        const account = process.env.PUBLIC_KEY;
        const privateKey = process.env.PRIVATE_KEY;
        const nonce = await web3.eth.getTransactionCount(account);
        const Contract = new web3.eth.Contract(abi);
       const deploy = await Contract.deploy({
        data: contract,
       }).encodeABI();
       const tx = {
        from: account,
        data: deploy,
        nonce: nonce,
        gas: 5000000,
       };
       const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
    const signedTx = await signPromise;
    const sentTx = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
    );
    console.log(
        "Your contract has been deployed at address:",
        sentTx.contractAddress
    );
    return {
        message: "Your contract has been deployed at address: " + sentTx.contractAddress + " and transaction hash is: " +
        "https://mumbai.polygonscan.com/tx/" + sentTx.transactionHash,  
        txHash: sentTx.transactionHash,
        success: true
    }
       
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}



export default deployContract;