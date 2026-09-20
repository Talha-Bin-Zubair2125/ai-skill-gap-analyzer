const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const connectDB = require("./db");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const authRoutes = require("./routes/authroutes");

// Load environment variables from .env file
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "your_secret_key";

// Debugging: Log the loaded environment variables
console.log("Loaded Environment Variables:");
console.log("PORT:", PORT);
console.log("MONGO_URI:", MONGO_URI);
console.log("COOKIE_SECRET:", COOKIE_SECRET);

connectDB();

// Routes
app.use("/api/auth", authRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
