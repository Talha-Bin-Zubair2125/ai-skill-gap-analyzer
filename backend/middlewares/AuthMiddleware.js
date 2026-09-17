const protect = (req, res, next) => {
  const userId = req.cookies._id;
  console.log("User ID from cookie:", userId); // Debugging: Log the user ID from the cookie
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // attach the user ID to the request object for further use in the route handler
  req.userId = userId;
  next();
};

module.exports = protect;