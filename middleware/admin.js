exports.checkUserRoleAdmin = (req, res, next) => {
    const userRole = req.user._doc.role;
  
    if (userRole === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized access" });
    }
};