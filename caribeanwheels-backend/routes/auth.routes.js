const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters")
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  login
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  forgotPassword
);

router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  resetPassword
);

// Profile
router.get("/profile", protect, getProfile);

router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .json({ message: "Logged out successfully" });
});

module.exports = router;