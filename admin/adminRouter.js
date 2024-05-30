const express = require("express");
const { adminCreate, adminLogin } = require("./adminController"); // Adjust the path as necessary
const authMiddleware = require("./authMiddleware"); // Adjust the path as necessary

const router = express.Router();

router.post("/create", adminCreate);
router.post("/login", adminLogin);

// Example of a protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.send({ message: "This is a protected route for admins only" });
});

module.exports = router;
