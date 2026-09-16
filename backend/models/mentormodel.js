const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
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
    designation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "mentor"],
      default: "mentor",
    },
  },
  { timestamps: true },
);

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
