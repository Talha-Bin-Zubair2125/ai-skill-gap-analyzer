const bycrypt = require("bcryptjs");
const Admin = require("./models/adminmodel");
const Mentor = require("./models/mentormodel");

const mentorpasswords = await bycrypt.hash("mentor@12", 10);

const mentors = [
  {
    Firstname: "John",
    Middlename: "Doe",
    Lastname: "Smith",
    email: "john.doe@gmail.com",
    password: mentorpasswords,
    designation: "Lecturer",
    role: "mentor",
  },
  {
    Firstname: "Jane",
    Middlename: "Doe",
    Lastname: "Smith",
    email: "jane.doe@gmail.com",
    password: mentorpasswords,
    designation: "Lecturer",
    role: "mentor",
  },
  {
    Firstname: "Bob",
    Middlename: "Doe",
    Lastname: "Smith",
    email: "bob.doe@gmail.com",
    password: mentorpasswords,
    designation: "Lecturer",
    role: "mentor",
  },
];
const seedData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await Mentor.deleteMany({});

    // Create admin user
    const adminPassword = await bycrypt.hash("admin@12", 10);
    const adminUser = new Admin({
      name: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    // Create mentor and admin users
    await Mentor.insertMany(mentors);
    console.log("Mentor users created successfully");
  } catch (error) {
    console.error("Error occurred while seeding data:", error);
  }
};

module.exports = seedData;
