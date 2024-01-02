const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.generateToken();
  
  res.status(StatusCodes.CREATED).json({ user:{name:user.name},token });
};





const login = async (req, res) => {
  const { email, password } = req.body; // get email and password from req.body
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user=await User.findOne({email})
  if(!user){
    throw new UnauthenticatedError("invalid credentials")
  }
  const isMatch=await user.comparePasswords(password)
  const token=user.generateToken()
  if(!isMatch){
    throw new UnauthenticatedError("invalid credentials")
  }
  res.status(StatusCodes.OK).json({user:{name:user.name},token})
};

module.exports = { register, login };
