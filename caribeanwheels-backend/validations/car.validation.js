const { body } = require("express-validator");

exports.createCarValidation = [
    body("title").notEmpty().withMessage("Title is required"),
    body("make").notEmpty().withMessage("Make is required"),
    body("model").notEmpty().withMessage("Model is required"),
    body("type").notEmpty().withMessage("Car type is required"),
    body("year")
        .isInt({ min: 1900 })
        .withMessage("Valid year is required"),
    body("condition")
        .optional()
        .isIn(["new", "used"])
        .withMessage("Invalid condition"),
    body("transmission")
        .isIn(["manual", "automatic"])
        .withMessage("Invalid transmission"),
    body("fuelType")
        .optional()
        .isIn(["petrol", "diesel", "hybrid", "electric"])
        .withMessage("Invalid fuel type"),
    body("regularPrice")
        .isNumeric()
        .withMessage("Regular price is required"),
];

exports.updateCarValidation = [
    body("year").optional().isInt({ min: 1900 }),
    body("regularPrice").optional().isNumeric(),
];