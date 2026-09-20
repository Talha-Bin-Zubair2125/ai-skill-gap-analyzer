const bcryptjs = require("bcryptjs");
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
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student").required(),
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
    const student = await Student.findById(req.user._id).select("-password");
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
    const admin = await Admin.findById(req.user._id).select("-password");
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

const getMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user._id).select("-password");
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

// Profile retrieval function that determines the role of the user and fetches the appropriate profile
const getprofile = async (req, res) => {
  try {
    // based on role of the user, call the appropriate profile retrieval function
    const role = req.user.role;
    console.log("User role:", role); // Debugging: Log the user role

    if (role === "student") {
      return getStudentProfile(req, res);
    } else if (role === "admin") {
      return getAdminProfile(req, res);
    } else if (role === "mentor") {
      return getMentorProfile(req, res);
    }
    
    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Error during profile retrieval:", error);
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
  getprofile,
  logout,
};
