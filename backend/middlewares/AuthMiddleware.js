const Admin = require("../models/adminmodel");
const Student = require("../models/studentmodel");
const Mentor = require("../models/mentormodel");

const protect = async (req, res, next) => {
  try {
    const user = req.signedCookies?.user || req.cookies?.user;

    console.log("User from cookie:", user);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    switch (user.role) {
      case "admin": {
        const admin = await Admin.findById(user.id);

        if (!admin) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        req.user = {
          id: admin._id,
          role: "admin",
        };

        console.log("Admin found:", admin);

        return next();
      }

      case "student": {
        const student = await Student.findById(user.id);

        if (!student) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        req.user = {
          id: student._id,
          role: "student",
        };

        return next();
      }

      case "mentor": {
        const mentor = await Mentor.findById(user.id);

        if (!mentor) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        req.user = {
          id: mentor._id,
          role: "mentor",
        };

        return next();
      }

      default:
        return res.status(401).json({
          message: "Unauthorized",
        });
    }
  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = protect;
