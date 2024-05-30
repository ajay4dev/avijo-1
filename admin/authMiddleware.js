const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).send({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send({ message: "Access denied. You are not an admin." });
    }

    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
