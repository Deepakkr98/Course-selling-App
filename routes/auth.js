import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// SignUp api - endpoint :-/api/auth/signup
router.post("/signup", async(req,res)=>{
  try{
    const {name, email, password }= req.body;
    const exitUser = await User.findOne({email});
    if(exitUser) {
      return res.status(400).json({message:"User already exists"});
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User ({name, email, password: hashedPassword});

    await newUser.save();

    res.status(201).json({message:"User created successfully"});

  }catch(err){
    res.status(500).json({message:err.message});

  }
});

// Login api endpoint :-/api/auth/login

router.post("/login",async(req, res)=>{
  try{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({message:"User not found"});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:"1d"});

    res.status(200).json({message:"Login successful", token});

  }catch(err){
    res.status(500).json({message:err.message});
  }
});

export default router;