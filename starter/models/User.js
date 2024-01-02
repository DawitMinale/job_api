const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 3,
  },
});


UserSchema.pre("save", async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})
UserSchema.methods.generateToken=function(){
    const token=jwt.sign({userId:this._id,user:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    return token
}
UserSchema.methods.comparePasswords=async function(password){
    const isMatch=await bcrypt.compare(password,this.password)
    return isMatch
}

module.exports=mongoose.model("User",UserSchema)
