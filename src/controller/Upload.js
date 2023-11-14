var fs = require("fs");
const cloudinary = require("cloudinary");
const UploadController = {
  storeFile: (req, res, next) => {
    console.log({ file: req.file });
    cloudinary.config({
      cloud_name: "drcennglp",
      api_key: "729876712741218",
      api_secret: "2Nab1vaN362dWS_c7N6DuX9b3aw",
    });
    cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
      console.log(result, error);
      if (result) {
        return res.status(200).send({
          ok: true,
          data: result,
          message: "File stored",
        });
      } else {
        return res.status(400).send({
          ok: true,
          data: error,
          message: "File stored",
        });
      }
    });
  },
};

module.exports = UploadController;
