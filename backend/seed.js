const bcrypt = require("bcryptjs");
const Admin = require("./models/adminmodel");
const Mentor = require("./models/mentormodel");

const seedData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await Mentor.deleteMany({});

    // Hash passwords
    const mentorPassword = await bcrypt.hash("mentor@12", 10);
    const adminPassword = await bcrypt.hash("admin@12", 10);

    // Create mentors
    const mentors = [
      {
        Firstname: "John",
        Middlename: "Doe",
        Lastname: "Smith",
        email: "john.doe@gmail.com",
        password: mentorPassword,
        designation: "Lecturer",
        role: "mentor",
      },
      {
        Firstname: "Jane",
        Middlename: "Doe",
        Lastname: "Smith",
        email: "jane.doe@gmail.com",
        password: mentorPassword,
        designation: "Lecturer",
        role: "mentor",
      },
      {
        Firstname: "Bob",
        Middlename: "Doe",
        Lastname: "Smith",
        email: "bob.doe@gmail.com",
        password: mentorPassword,
        designation: "Lecturer",
        role: "mentor",
      },
    ];

    // Create admin
    const adminUser = new Admin({
      name: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");

    // Create mentors
    await Mentor.insertMany(mentors);
    console.log("Mentor users created successfully");

  } catch (error) {
    console.error("Error occurred while seeding data:", error);
  }
};

module.exports = seedData;