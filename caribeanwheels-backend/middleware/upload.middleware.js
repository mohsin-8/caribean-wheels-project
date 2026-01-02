const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // VIN REPORT (PDF ONLY)
    if (file.fieldname === "vinReport") {
      return {
        folder: "cars/vin-reports",
        resource_type: "raw",
        format: "pdf",
        public_id: `vin_${Date.now()}`,
      };
    }

    // CAR IMAGES
    return {
      folder: "cars/images",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `car_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    };
  },
});

// STRICT FILTER
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "vinReport") {
    return file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF allowed for VIN Report"), false);
  }

  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  cb(new Error("Invalid file type"), false);
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});