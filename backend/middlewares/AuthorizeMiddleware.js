const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("User role from request:", req.user.role); // Debugging: Log the user role from the request
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = { authorize };
