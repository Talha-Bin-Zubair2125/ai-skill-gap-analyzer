const bycrypt = require("bcrypt");
const Student = require("../models/studentmodel");

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
    const hashedPassword = await bycrypt.hash(password, 10);
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
    const isPasswordValid = await bycrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Cookie handling and response
    res.cookie("user", req.user._id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", user: student });
    
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
