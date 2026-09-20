const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  loginMentor,
  getStudentProfile,
  getAdminProfile,
  getMentorProfile,
  logout,
} = require("../controllers/AuthController");
const  protect  = require("../middlewares/AuthMiddleware");
const { authorize } = require("../middlewares/AuthorizeMiddleware");

router.post("/register", registerStudent);

// Same route for login but different controllers for each role
router.post("/login/admin", loginAdmin);
router.post("/login/student", loginStudent);
router.post("/login/mentor", loginMentor);

// Profile routes for each role
router.get("/admin/profile", protect, authorize("admin"), getAdminProfile);
router.get("/student/profile", protect, authorize("student"), getStudentProfile);
router.get("/mentor/profile", protect, authorize("mentor"), getMentorProfile);


router.post("/logout", logout);

module.exports = router;
