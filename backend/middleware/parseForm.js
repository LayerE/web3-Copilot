import fs from "fs";
import formidable from "formidable";

const parseForm = (req, res, next) => {
  try {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          message: "Error",
          error: err,
        });
      }
      req.body = fields;
      req.files = files;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error,
    });
  }
};

const bulkUploadForm = (req, res, next) => {
  try {
    let id = req.query.id;
    // if images folder not exist
    if (!fs.existsSync("./uploads/images")) {
      // resurcive create folder
      fs.mkdirSync("./uploads/images", { recursive: true });
    }
    // create folder if not exist
    if (!fs.existsSync("./uploads/images/" + id)) {
      fs.mkdirSync("./uploads/images/" + id);
    }
    if (!fs.existsSync("./uploads/csv")) {
      fs.mkdirSync("./uploads/csv", { recursive: true });
    }
    if (!fs.existsSync("./uploads/csv/" + id)) {
      fs.mkdirSync("./uploads/csv/" + id);
    }
    let count = 0;
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: "./uploads/images/" + id,
      filename: function (name, ext, part, form) {
        if (ext === "csv") {
          return "raw.csv";
        }
        return count++ + ext;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error",
          error: err,
        });
      }
      req.body = fields;
      req.files = files;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error,
    });
  }
};

export { parseForm, bulkUploadForm };
