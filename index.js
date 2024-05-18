const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const labAuthRoutes = require("./routes/lapAuthRoutes");
const hppAuthRoutes = require ("./routes/hppAuthRoute")
const doctorConsultationRoutes = require ("./routes/doctorConsultationRoutes")

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
const connectDB = require("./db");
require("dotenv").config;

dotenv.config();

const PORT = 6060;

app.use(cors());

connectDB();
   
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "folder_name",
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});

app.use("/user", userRoutes);
app.use("/labAuth", labAuthRoutes);
app.use("/hppAuth", hppAuthRoutes);
app.use("/ConsultationAuth", doctorConsultationRoutes);



app.get("/", (req, res) => {
  res.json({
    message: "Api is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
