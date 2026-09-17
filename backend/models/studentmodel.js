const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: true,
    },
    Middlename: {
      type: String,
    },
    Lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "mentor"],
      default: "student",
    },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;