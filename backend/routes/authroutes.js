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
router.post("/login/student", loginStudent);
router.post("/login/admin", loginAdmin);
router.post("/login/mentor", loginMentor);
router.get(
  "/profile/student",
  protect,
  authorize("student", "admin", "mentor"),
  getStudentProfile,
);
router.get("/profile/admin", protect, authorize("admin"), getAdminProfile);
router.get("/profile/mentor", protect, authorize("mentor"), getMentorProfile);

module.exports = router;