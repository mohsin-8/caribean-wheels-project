const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    make: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "new",
    },

    stockNumber: {
      type: String,
    },

    vinNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    mileage: {
      type: Number,
      default: 0,
    },

    // Technical Details
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },

    driveType: {
      type: String,
    },

    engineSize: {
      type: String,
    },

    cylinders: {
      type: Number,
    },

    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "hybrid", "electric"],
    },

    doors: {
      type: Number,
    },

    seats: {
      type: Number,
    },

    color: {
      type: String,
    },

    cityMPG: {
      type: Number,
    },

    highwayMPG: {
      type: Number,
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
    },

    priceLabel: {
      type: String,
      enum: ["fixed", "negotiable"],
      default: "fixed",
    },

    features: {
      comfort: [String],
      entertainment: [String],
      safety: [String],
      windows: [String],
      seats: [String],
    },

    description: {
      type: String,
    },

    location: {
      address: String,
      latitude: Number,
      longitude: Number,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    videoUrl: {
      type: String,
    },

    vinReport: {
      url: String,
      publicId: String,
      originalName: String,
      format: String,
      data: Buffer,
      contentType: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);