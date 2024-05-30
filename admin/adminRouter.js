const express = require("express");
const { adminCreate, adminLogin, totalProfile,  } = require("./adminController"); 
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.post("/create", adminCreate);
router.post("/login", adminLogin);
router.get("/totalProfile", authMiddleware, totalProfile);

// Example of a protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.send({ message: "This is a protected route for admins only" });
});

module.exports = router;
