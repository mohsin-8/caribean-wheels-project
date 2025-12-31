const express = require("express");
const router = express.Router();

const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

const {
  createCarValidation,
  updateCarValidation,
} = require("../validations/car.validation");

const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.get("/", getCars);
router.get("/:id", getCarById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "vinReport", maxCount: 1 },
  ]),
  createCarValidation,
  createCar
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "vinReport", maxCount: 1 },
  ]),
  updateCarValidation,
  updateCar
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCar
);

module.exports = router;