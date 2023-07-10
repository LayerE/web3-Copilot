import fs from "fs";

import uploadToIPFS from "../utils/uploadIPFS.js";
import { File } from "web3.storage";

const HandleMetadata = async (req, res) => {
  try {
    const { name,description } = req.body;
    console.log(req.body);
    const image = req.files?.image;
    const IPFS = async (image) => {
      var tempfile = image;
      var fileBuffer = await fs.readFileSync(tempfile.filepath);
      var file = new File([fileBuffer], tempfile.originalFilename, {
        type: tempfile.mimetype,
      });
      return await uploadToIPFS(file);
    };
    let newImage = typeof image === "string" ? image : await IPFS(image);
    const obj = {
      name: name,
      description: description,
      image: newImage?.includes("https://")
        ? newImage
        : "https://ipfs.io/ipfs/" + newImage + "/" + image?.originalFilename,
    };
    const file = new File([JSON.stringify(obj)], "metadata.json");
    const cid = await uploadToIPFS(file);
    const metadata = `https://ipfs.io/ipfs/${cid}/metadata.json`;
    return res.status(200).json({
        metadata: metadata,
        success: true
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: error.message,
        success: false
    })
  }
};

export {
    HandleMetadata
};