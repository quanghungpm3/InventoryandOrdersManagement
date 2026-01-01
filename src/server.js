import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";

import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute); // GET public

// private routes
app.use("/api/users", protectedRoute, userRoute);
app.use("/api/orders", protectedRoute, orderRoute);



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});
