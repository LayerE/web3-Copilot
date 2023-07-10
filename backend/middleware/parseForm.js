import fs from "fs";
import formidable from "formidable";

const parseForm = (req, res, next) => {
    try{
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
        return res.status(500).json({
            message: 'Error',
            error: err,
        });
        }
        req.body = fields;
        req.files = files;
        next();
    });
    } catch(error){
        return res.status(500).json({
            message: 'Error',
            error: error,
        });
    }
}

export default parseForm;