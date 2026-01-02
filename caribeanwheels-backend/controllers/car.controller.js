const Car = require("../models/Car.model");
const { validationResult } = require("express-validator");
const fs = require("fs");

exports.createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // VIN uniqueness
    if (req.body.vinNumber) {
      const vinExists = await Car.findOne({ vinNumber: req.body.vinNumber });
      if (vinExists) {
        return res.status(409).json({
          success: false,
          message: "VIN already exists",
        });
      }
    }

    // Images
    const images = req.files?.images?.map((file) => ({
      url: file.path,
      publicId: file.filename,
    })) || [];

    // VIN REPORT (PDF)
    let vinReport = null;
    if (req.files?.vinReport?.[0]) {
      const file = req.files.vinReport[0];

      vinReport = {
        url: file.path,               // Cloudinary URL
        publicId: file.filename,
        originalName: file.originalname,
        contentType: file.mimetype,   // application/pdf
      };
    }

    const car = await Car.create({
      ...req.body,
      images,
      vinReport,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    let {
      make,
      model,
      type,
      condition,
      minPrice,
      maxPrice,
      year,
      sortBy,
      page = 1,
      limit = 6,
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 6;

    const query = {};

    // ✅ Ignore empty strings
    if (make?.trim()) query.make = { $regex: make, $options: "i" };
    if (model?.trim()) query.model = { $regex: model, $options: "i" };
    if (type?.trim()) query.type = { $regex: type, $options: "i" };
    if (condition?.trim()) query.condition = condition;

    if (year && !isNaN(year) && Number(year) > 0) {
      query.year = Number(year);
    }

    if (
      (minPrice && !isNaN(minPrice)) ||
      (maxPrice && !isNaN(maxPrice))
    ) {
      query.regularPrice = {};
      if (minPrice && !isNaN(minPrice)) {
        query.regularPrice.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        query.regularPrice.$lte = Number(maxPrice);
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "price_asc") sortOptions = { regularPrice: 1 };
    if (sortBy === "price_desc") sortOptions = { regularPrice: -1 };
    if (sortBy === "year_desc") sortOptions = { year: -1 };

    const total = await Car.countDocuments(query);

    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      cars,
    });
  } catch (error) {
    console.error("getCars error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let updatedData = { ...req.body };

    if (req.files?.images) {
      updatedData.images = req.files.images.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    if (req.files?.vinReport?.[0]) {
      updatedData.vinReport = {
        url: req.files.vinReport[0].path,
        publicId: req.files.vinReport[0].filename,
      };
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    res.json({
      success: true,
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!car)
      return res.status(404).json({ message: "Car not found" });

    res.json({
      success: true,
      message: "Car removed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.viewVinReport = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car || !car.vinReport?.url) {
      return res.status(404).json({ message: "VIN report not found" });
    }

    // Force browser to OPEN, not download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    return res.redirect(car.vinReport.url);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};