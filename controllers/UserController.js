const User = require("../models/UserModel");
const Cred = require("../models/CredentialModel");
const sms = require("./sendOtp")

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("email :", email)
    const user = await await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.json({ msg: "Error fetching movies." });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else return res.json({ msg: "Movie already added to the liked list." });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ msg: "Movie successfully added to liked list." });
  } catch (error) {
    return res.json({ msg: "Error adding movie to the liked list" });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (!movieIndex) {
        res.status(400).send({ msg: "Movie not found." });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie successfully removed.", movies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.json({ msg: "Error removing movie to the liked list" });
  }
};

module.exports.signupUser = async (req, res) => {
  try {
    const { email, password, mobile, otp } = req.body;
    console.log("email:",email,"password:",password, "mobile:",mobile, "otp:",otp)

    let user = await Cred.find({mobile_no:mobile});
    console.log("user profile :", user[0].otp)
    if(user[0].otp == otp){
    let obj = {email: email, password:password} 
    await Cred.updateOne(obj);
    
      res.json({result:"success" ,msg: "User successfully created"})
    
  }else{
    res.json({result: "failed" ,msg: "Otp is wrong"})
  }
  } catch (error) {
    return res.json({ msg: "Error removing movie to the liked list" });
  }
};

module.exports.otpForUser = async (req, res) => {
  try {
    let mobile = `+${req.body.mobile}`
    console.log("req me kya aya :",mobile)

    let otp = Math.floor(Math.random() * (999 - 100 + 1) + 100)
    console.log("otp is :",otp)

    let obj = {mobile_no: mobile, otp:otp }
    let check_usr = await Cred.findOne({mobile_no:mobile})
    console.log("check eamil :",check_usr)

    if (check_usr.email){

      return res.json({result: "failed" ,msg: "User already exist with this moble number"})
    }
    
    await Cred.updateOne({mobile_no:mobile},obj,{upsert:true});
    let text = `your otp is ${otp}`
    console.log(text)
    await sms.sendOtp(text,mobile)

    return res.json({result: "success" ,msg: "OTP send successfully"})

  } catch (error) {
    return res.json({result: "failed" ,msg: "OTP will not send on this number due to network issue, Please try after some time"})
  }
}

module.exports.loginUser = async (req,res) => {

console.log("user try to login :", req.body)

let email = req.body.email
let password = req.body.password
let user = await Cred.find({email:email})
console.log("user profile :", user)

if (user){
  let pass = await Cred.findOne({password:password},{"password":true})
  console.log("got the pass :", pass)
  if(pass === null){
    return res.json({result: "failed" ,msg: "Wrong password"}) 
  }else{
    return res.json({result: "success" ,msg: "User login successfully"})
  }
}else{
  return res.json({result: "failed" ,msg: "User not exist with this email"})

}
}