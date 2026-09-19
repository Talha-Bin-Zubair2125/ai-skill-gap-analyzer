const protect = (req, res, next) => {
  const user = req.cookies.user; // Assuming the cookie name is 'user'
  console.log("User from cookie:", user); // Debugging: Log the user from the cookie
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // attach the user data to the request object for further use in the route handler
  req.user = user;
  next();
};

module.exports = protect;