const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  loginAdmin,
  loginMentor,
  getAdminProfile,
  getMentorProfile,
} = require("../controllers/AuthController");
const { protect } = require("../middlewares/AuthMiddleware");
const { authorize } = require("../middlewares/AuthorizeMiddleware");

router.post("/register", registerStudent);

// Same route for login but different controllers for each role
router.post("/login", loginStudent);
router.post("/login", loginAdmin);
router.post("/login", loginMentor);

router.get(
  "/profile/student",
  protect,
  authorize("student", "admin", "mentor"),
  getStudentProfile,
);
router.get("/profile/admin", protect, authorize("admin"), getAdminProfile);
router.get("/profile/mentor", protect, authorize("mentor"), getMentorProfile);

module.exports = router;