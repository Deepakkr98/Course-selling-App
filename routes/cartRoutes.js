import express from "express";
import Cart from "../models/Cart.js";
import Course from "../models/Course.js";

const router = express.Router();

// Add to Cart : /api/cart/add
 router.post("/add", async(req, res)=>{
  try{
    const {userId, courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    //check course exist or not 
    let cartItem = await Cart.findOne({ userId, courseId });

    if(cartItem){
      cartItem.quantity += 1;
      await cartItem.save();
      return res.json({message:"Quantity increased",cartItem});
    }else{
      const newItem = new Cart ({userId, courseId});
      await newItem.save();
      return res.json({message:"Course added to cart", newItem});
    }

  }catch(err){
    res.status(500).json({ error: err.message});
  }
 });

 // Decrease Quantity : /api/cart/decrease
router.post("/decrease", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    let cartItem = await Cart.findOne({ userId, courseId });
    if (!cartItem) return res.status(404).json({ message: "Course not found in cart" });

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      return res.json({ message: "Quantity decreased", cartItem });
    } else {
      await Cart.deleteOne({ userId, courseId });
      return res.json({ message: "Course removed from cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


 // Get cart : /api/cart/userId

 router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId }).populate("courseId");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 // Remove product : /api/cart/user1/courseId

 router.delete("/:userId/:courseId", async(req, res)=>{
  try {
    const {userId, courseId} = req.params;
    await Cart.findByIdAndDelete({userId, courseId});
    res.json({message:"Course removed from cart"});
    
  } catch (err) {
    err.status(500).json({error: err.message});
    
  }
 })

 export default router;