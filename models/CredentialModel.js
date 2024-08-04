const mongoose = require("mongoose");

const credSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  mobile_no: {
    type: Number,
    required: true,
    max: 12,
  },
  otp:{
    type: Number,
    required: true,
    unique: true
  },
  timestamp : {type : Number, default : Date.now},
});

module.exports = mongoose.model("cred", credSchema);
