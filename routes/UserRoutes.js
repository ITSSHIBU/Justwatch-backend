const {
  addToLikedMovies,
  getLikedMovies,
  removeFromLikedMovies,
  signupUser,
  otpForUser,
  loginUser
} = require("../controllers/UserController");

const router = require("express").Router();

router.get("/liked/:email", getLikedMovies);
router.post("/add", addToLikedMovies);
router.put("/remove", removeFromLikedMovies);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/otp", otpForUser);

module.exports = router;
