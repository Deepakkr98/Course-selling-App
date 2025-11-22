import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// STEP 1: Create order when user clicks BUY
router.post("/create-order", async (req, res) => {
  try {
    const { userId } = req.body;

    const cartItems = await Cart.find({ userId }).populate("courseId");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.courseId.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STEP 2: Verify Payment Signature
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Store Order in DB
    const cartItems = await Cart.find({ userId });

    const newOrder = await Order.create({
      userId,
      items: cartItems,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Paid",
    });

    // Empty cart after successful payment
    await Cart.deleteMany({ userId });

    res.json({ success: true, message: "Payment verified", newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
