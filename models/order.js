import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        quantity: Number,
      },
    ],
    paymentId: String,
    orderId: String,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
