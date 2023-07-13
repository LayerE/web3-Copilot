import fs from "fs";

import uploadToIPFS from "../utils/uploadIPFS.js";
import { File } from "web3.storage";
import { parse } from "csv-parse";
import uploadBulkToIPFS from "../utils/uploadBulkIPFS.js";

const HandleMetadata = async (req, res) => {
  try {
    const { name, description } = req.body;
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
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const getAllFilesExt = (dir) => {
  let results = [];
  // get files in directory and add the extension to the results array
  fs.readdirSync(dir).forEach((file) => {
    console.log(file);
    results.push(file?.split(".").pop());
  });
  return results;
};

const readCSV = async (file) => {
  try {
    const fileOps = fs.createReadStream(file);
    const csvData = [];
    const check = fileOps.pipe(
      parse({
        columns: true,
      })
    );

    for await (const row of check) {
      csvData.push(row);
    }

    console.log(csvData);
    console.log("CSV file successfully processed");

    return csvData;
  } catch (error) {
    console.log(error);
  }
};

const BulkGenerateMetadata = async (req, res) => {
  const id = req.query.id;
  try {
    const { name, description } = req.body;
    const length = req.files?.images?.length;
    console.log(req.files.metadata?.length, length);

    let metadata = req.files?.metadata;
    if (metadata) {
      // mv the file to uploads/csv/id
      await fs.renameSync(
        metadata.filepath,
        "./uploads/csv/" + id + "/" + metadata.originalFilename
      );
      // change the path of the file
      metadata = "./uploads/csv/" + id + "/" + metadata.originalFilename;
    }

    let csvData = [];

    if (metadata) {
      const csvData = await readCSV(metadata);

      // check whether the length of csv and images are same
      if (csvData.length !== length) {
        return res.status(400).json({
          error: "Number of images and csv data are not same",
          success: false,
        });
      }
      const upload = await uploadBulkToIPFS("./uploads/images/" + id);
      let ext = getAllFilesExt("./uploads/images/" + id);
      // create a folder called metadata if not exist
      if (!fs.existsSync("./uplaods/metadata")) {
        fs.mkdirSync("./uploads/metadata", { recursive: true });
      }
      // create a folder called metadata if not exist
      if (!fs.existsSync("./uploads/metadata/" + id)) {
        fs.mkdirSync("./uploads/metadata/" + id);
      }
      csvData.forEach(async (data, index) => {
        const obj = {
          name: data.name,
          description: data.description,
          image:
            index < length
              ? "https://ipfs.io/ipfs/" +
                upload +
                "/" +
                index +
                "." +
                ext[index]
              : undefined,
        };
        // store metadata in metadata folder
        await fs.writeFileSync(
          "./uploads/metadata/" + id + "/" + index + ".json",
          JSON.stringify(obj)
        );
      });
      const uploadMetadata = await uploadBulkToIPFS("./uploads/metadata/" + id);
      console.log(uploadMetadata);
      fs.rmSync("./uploads/images/" + id, { recursive: true });
      fs.rmSync("./uploads/metadata/" + id, { recursive: true });
      fs.rmSync("./uploads/csv/" + id, { recursive: true });
      return res.status(200).json({
        metadata: "https://ipfs.io/ipfs/" + uploadMetadata + "/",
        success: true,
        length: length,
      });
    }
    const upload = await uploadBulkToIPFS("./uploads/images/" + id);
    // create a folder called metadata if not exist
    if (!fs.existsSync("./uplaods/metadata")) {
      fs.mkdirSync("./uploads/metadata", { recursive: true });
    }
    // create a folder called metadata if not exist
    if (!fs.existsSync("./uploads/metadata/" + id)) {
      fs.mkdirSync("./uploads/metadata/" + id);
    }

    let ext = getAllFilesExt("./uploads/images/" + id);
    for (let i = 0; i < length; i++) {
      const obj = {
        name: name + " " + i,
        description: description,
        image: "https://ipfs.io/ipfs/" + upload + "/" + i + "." + ext[i],
      };
      // store metadata in metadata folder
      await fs.writeFileSync(
        "./uploads/metadata/" + id + "/" + i + ".json",
        JSON.stringify(obj)
      );
    }
    const uploadMetadata = await uploadBulkToIPFS("./uploads/metadata/" + id);
    console.log(uploadMetadata);

    fs.rmSync("./uploads/images/" + id, { recursive: true });
    fs.rmSync("./uploads/metadata/" + id, { recursive: true });
    return res.status(200).json({
      metadata: "https://ipfs.io/ipfs/" + uploadMetadata + "/",
      success: true,
      length: length,
    });
  } catch (error) {
    fs.rmSync("./uploads/images/" + id, { recursive: true });
    fs.rmSync("./uploads/metadata/" + id, { recursive: true });
    fs.rmSync("./uploads/csv/" + id, { recursive: true });
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

export { HandleMetadata, BulkGenerateMetadata };
