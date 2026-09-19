const seedData = require("./seed");
const connectDB = require("./db");

const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error occurred while running seed:", error);
    process.exit(1);
  }
};

runSeed();
