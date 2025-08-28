import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";  

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courseRoute.js";
import cartRoutes from "./routes/cartRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is Home page");
});


// user Routes
app.use("/api/auth", authRoutes);
// Course Routes
app.use("/api/courses", courseRoutes);
// cart Routes
app.use("/api/cart", cartRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Database connected"))
.catch(err=> console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT,(res, req) => {
  console.log(`Server running locally: http://localhost:${PORT}`);
});