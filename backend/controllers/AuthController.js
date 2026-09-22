const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Student = require("../models/studentmodel");
const Mentor = require("../models/mentormodel");
const Admin = require("../models/adminmodel");

// JOI validation schema
const Joi = require("joi");

// JOI validation schema for student registration
const studentRegistrationSchema = Joi.object({
  Firstname: Joi.string().required(),
  Middlename: Joi.string().allow(""),
  Lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student").required(),
});

// JOI validation schema for student login
const studentLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// JOI validation schema for student update
const studentUpdateSchema = Joi.object({
  Firstname: Joi.string().required(),
  Middlename: Joi.string().allow("").optional(),
  Lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("student").required(),
});

// JOI validation schema for admin profile update
const adminUpdateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("admin").required(),
});

// JOI validation schema for mentor profile update
const mentorUpdateSchema = Joi.object({
  Firstname: Joi.string().required(),
  Middlename: Joi.string().allow("").optional(),
  Lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("mentor").required(),
});

// Register a new student
const registerStudent = async (req, res) => {
  const { error } = studentRegistrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { Firstname, Middlename, Lastname, email, password, role } = req.body;
  // Debugging: Log the received data
  console.log("Received registration data:", req.body);
  try {
    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newStudent = new Student({
      Firstname,
      Middlename,
      Lastname,
      email,
      password: hashedPassword,
      role,
    });
    await newStudent.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during student registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a student
const loginStudent = async (req, res) => {
  const { error } = studentLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;
  // Debugging: Log the received data
  console.log("Received login data:", req.body);
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcryptjs.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Cookie handling and response
    res.cookie(
      "user",
      { id: student._id, role: "student" },
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    res.status(200).json({ message: "Login successful", user: student });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// profile of a student
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student profile retrieved successfully",
      user: student,
    });
  } catch (error) {
    console.error("Error during student profile retrieval:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Student profile update function
const updateStudentProfile = async (req, res) => {
  const { error } = studentUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { Firstname, Middlename, Lastname, email, password, role } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    student.Firstname = Firstname;
    student.Middlename = Middlename;
    student.Lastname = Lastname;
    student.email = email;
    student.password = hashedPassword;
    student.role = role;
    await student.save();
    res.status(200).json({
      message: "Student profile updated successfully",
      user: student,
    });
  } catch (error) {
    console.error("Error during student profile update:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch the profile of a student by ID
const getStudentProfileById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student profile retrieved successfully",
      user: student,
    });
  } catch (error) {
    console.error("Error during student profile retrieval by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Student forget password function
const forgetPasswordStudent = async (req, res) => {
  const { email } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Generate a reset token -- generate a random token using crypto and convert it to a hexadecimal string
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Set the reset token and expiration time in the student document
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpires = Date.now() + 3600000;
    await student.save();

    // Debugging: Log the reset token and expiration time
    console.log("Reset token generated:", resetToken);
    console.log("Reset token expiration time:", student.resetPasswordExpires);
    console.log("Student email:", student.email);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    // Send the reset token to the student's email -- nodemailer connects to Gmail's SMTP server and sends an email with the reset token
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password-student/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "Password Reset - AI Skill Gap Analyzer",
      text: `You requested a password reset.

      Click the following link to reset your password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you did not request a password reset, you can safely ignore this email.

      Regards,
      AI Skill Gap Analyzer Team

      For any queries, contact us at:
      support@aiskillgap.com
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Password reset token sent to email",
    });

  } catch (error) {
    console.error("Error during student forget password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Student reset password function
const resetPasswordStudent = async (req, res) => {
  const { token, password } = req.body;
  try {
    const student = await Student.findOne({
      resetPasswordToken:
  token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!student) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    student.password = hashedPassword;
    student.resetPasswordToken = null;
    student.resetPasswordExpires = null;
    await student.save();
    res.status(200).json({ message: "Password reset successful" });
  }
  catch (error) {
    console.error("Error during student reset password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin and Mentor Login functions can be implemented similarly, with their respective models and validation schemas.
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received admin login data:", req.body); // Debugging: Log the received data
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("Admin found:", admin._id); // Debugging: Log the found admin
    res.cookie(
      "user",
      {
        id: admin._id,
        role: "admin",
      },
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    res.status(200).json({ message: "Login successful", user: admin });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received mentor login data:", req.body); // Debugging: Log the received data
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcryptjs.compare(password, mentor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.cookie(
      "user",
      {
        id: mentor._id,
        role: "mentor",
      },
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    res.status(200).json({ message: "Login successful", user: mentor });
  } catch (error) {
    console.error("Error during mentor login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Profile retrieval functions for Admin and Mentor can also be implemented similarly, using their respective models.
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin profile retrieved successfully", user: admin });
  } catch (error) {
    console.error("Error during admin profile retrieval:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin profile update function
const updateAdminProfile = async (req, res) => {
  const { error } = adminUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, password, role } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    console.log("Admin found for update:", admin); // Debugging: Log the found admin
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    admin.name = name;
    admin.email = email;
    admin.password = hashedPassword;
    admin.role = role;
    await admin.save();
    res.status(200).json({
      message: "Admin profile updated successfully",
      user: admin,
    });
  } catch (error) {
    console.error("Error during admin profile update:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get admin profile by id
const getAdminProfileById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin profile retrieved successfully", user: admin });
  } catch (error) {
    console.error("Error during admin profile retrieval by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user.id).select("-password");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res
      .status(200)
      .json({ message: "Mentor profile retrieved successfully", user: mentor });
  } catch (error) {
    console.error("Error during mentor profile retrieval:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mentor profile update function
const updateMentorProfile = async (req, res) => {
  const { error } = mentorUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { Firstname, Middlename, Lastname, email, password, role } = req.body;
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    mentor.Firstname = Firstname;
    mentor.Middlename = Middlename;
    mentor.Lastname = Lastname;
    mentor.email = email;
    mentor.password = hashedPassword;
    mentor.role = role;
    await mentor.save();
    res.status(200).json({
      message: "Mentor profile updated successfully",
      user: mentor,
    });
  } catch (error) {
    console.error("Error during mentor profile update:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get mentor profile by id
const getMentorProfileById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).select("-password");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res
      .status(200)
      .json({ message: "Mentor profile retrieved successfully", user: mentor });
  } catch (error) {
    console.error("Error during mentor profile retrieval by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout function to clear the cookie
const logout = (req, res) => {
  res.clearCookie("user", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  loginAdmin,
  loginMentor,
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
};
