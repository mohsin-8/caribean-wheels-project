const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

exports.upload = multer({ storage });