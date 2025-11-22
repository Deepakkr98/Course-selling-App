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

// Get all user : /api/auth/users
router.get("/users", async(req, res)=>{
  try{
      const users = await User.find().select("-password");
      res.status(200).json(users);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

// Get Single User by id :  /api/auth/users/:id
router.get("/users/:id",async (req,res)=>{
  try {
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.json(200).json(user);
    
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Update user : /api/auth/users/:id

router.put("/users/:id", async(req,res) =>{
  try {
    const {name,email, password, role} = req.body;
    const updateData = {name , email, role};

    // if password update then firstly hash
    if(password){
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new:true}
      ).select("-password");
    }
    if(!updatedUser){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(updatedUser);
    
  } catch (err) {
    res.json(err).json({message: err.message});
    
  }

});

// Delete user : /api/auth/users/:id

router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;