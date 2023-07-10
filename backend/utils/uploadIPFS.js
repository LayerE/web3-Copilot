import { Web3Storage } from 'web3.storage';

async function uploadToIPFS(image) {
    try{    
        const storage = new Web3Storage({ token: process.env.WEB3TOKEN });
        const cid = await storage.put([image])
        return cid
    }  catch(error){
        return error
    }
}

export default uploadToIPFS;