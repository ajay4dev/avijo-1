const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const userRoutes = require("./routes/userRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const labAuthRoutes = require("./routes/lapAuthRoutes");
const hppAuthRoutes = require("./routes/hppAuthRoute");
const doctorConsultationRoutes = require("./routes/doctorConsultationRoutes");
const careerRoutes = require("./career/routes/careerRoute");


//AdminRouter
const adminRouter = require("./admin/adminRouter");


const connectDB = require("./db");
connectDB();


require('./career/model/loginModel');


// Passport config
require('./career/config/passport');





const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
require("dotenv").config;

dotenv.config();





const PORT = 6060;
var corsOptions = {
  origin: "*", // Allow only this origin
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));




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
app.use("/pharmacy", pharmacyRoutes);
app.use("/doctor", doctorRoutes);
app.use("/labAuth", labAuthRoutes);
app.use("/hppAuth", hppAuthRoutes);
app.use("/ConsultationAuth", doctorConsultationRoutes);
app.use("/career", careerRoutes);

//admin url
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Api is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
