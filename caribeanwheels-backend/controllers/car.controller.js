const Car = require("../models/Car.model");
const { validationResult } = require("express-validator");

exports.createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const images = req.files?.images
      ? req.files.images.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : [];

    const vinReport = req.files?.vinReport?.[0]
      ? {
          url: req.files.vinReport[0].path,
          publicId: req.files.vinReport[0].filename,
        }
      : null;

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
    res.status(500).json({ message: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const {
      make,
      model,
      type,
      condition,
      minPrice,
      maxPrice,
      year,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (make) query.make = make;
    if (model) query.model = model;
    if (type) query.type = type;
    if (condition) query.condition = condition;
    if (year) query.year = year;

    if (minPrice || maxPrice) {
      query.regularPrice = {};
      if (minPrice) query.regularPrice.$gte = Number(minPrice);
      if (maxPrice) query.regularPrice.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "price_asc") sortOptions = { regularPrice: 1 };
    if (sortBy === "price_desc") sortOptions = { regularPrice: -1 };
    if (sortBy === "year_desc") sortOptions = { year: -1 };

    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("createdBy", "name email");

    const total = await Car.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      cars,
    });
  } catch (error) {
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