const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/me")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUser);

module.exports = router;
