const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  loginMentor,
  getprofile,
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
router.get("/profile", protect, authorize("admin"), getprofile);
router.get("/profile", protect, authorize("student"), getprofile);
router.get("/profile", protect, authorize("mentor"), getprofile);

router.post("/logout", logout);

module.exports = router;
