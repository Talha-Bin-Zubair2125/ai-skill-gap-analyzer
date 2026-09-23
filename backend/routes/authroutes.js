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
  updateStudentProfile,
  getStudentProfileById,
  updateAdminProfile,
  getAdminProfileById,
  updateMentorProfile,
  getMentorProfileById,
  forgetPasswordStudent,
  resetPasswordStudent,
  forgetPasswordMentor,
  resetPasswordMentor,
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

// Profile routes for each role by ID
router.get("/admin/profile/:id", protect, authorize("admin"), getAdminProfileById);
router.get("/student/profile/:id", protect, authorize("student"), getStudentProfileById);
router.get("/mentor/profile/:id", protect, authorize("mentor"), getMentorProfileById);

// Update profile routes for each role
router.put("/admin/profile-update/:id", protect, authorize("admin"), updateAdminProfile);
router.put("/student/profile-update/:id", protect, authorize("student"), updateStudentProfile);
router.put("/mentor/profile-update/:id", protect, authorize("mentor"), updateMentorProfile);

// Password reset routes for students
router.post("/student/forget-password", forgetPasswordStudent);
router.post("/student/reset-password/:token", resetPasswordStudent);

// Password reset routes for mentors
router.post("/mentor/forget-password", forgetPasswordMentor);
router.post("/mentor/reset-password/:token", resetPasswordMentor);


router.post("/logout", logout);

module.exports = router;
