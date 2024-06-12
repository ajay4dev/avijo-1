const express = require("express");
const {
  createJob,
  getAllJob,
  getJobById,
  updatecareerJob,
  deleteJob,
  filterCareerJobs,
} = require("../controller/careerControllers");
const router = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const {
  careerUserCreate,
  careerUserGetAll,
  careerUserGetById,
  careerUserUpdate,
  careerUserDelete,
} = require("../controller/careerUser");

router.post("/createJob", createJob);
router.get("/getAllJob", getAllJob);
router.get("/getJobById/:id", getJobById);
router.get("/filterJobs", filterCareerJobs);
router.put("/updateJob/:id", updatecareerJob);
router.delete("/deleteJob/:id", deleteJob);

router.post("/createUser", careerUserCreate);
router.get("/getAllUser", careerUserGetAll);
router.get("/getByIdUser/:id", careerUserGetById);
router.delete("/deleteUser/:id", careerUserDelete);



// Express session
router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

router.get("/", (req, res) => res.send("Home Page"));

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`Hello ${req.user.name}`);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
