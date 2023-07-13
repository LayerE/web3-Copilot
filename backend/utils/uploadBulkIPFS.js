import { NFTStorage, File } from "nft.storage";
import fs from "fs";

async function uploadBulkToIPFS(dir) {
  try {
    const nftstorage = new NFTStorage({ token: process.env.NFTSTORAGE });
    const files = fs
      .readdirSync(dir)
      .map((name) => new File([fs.readFileSync(`${dir}/${name}`)], name));
    const cid = await nftstorage.storeDirectory(files);
    console.log({ cid });
    const status = await nftstorage.status(cid);
    console.log({ status });
    return cid;
  } catch (error) {
    return error;
  }
}

export default uploadBulkToIPFS;
