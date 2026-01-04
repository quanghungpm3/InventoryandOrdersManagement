import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


const CLIENT_URL = process.env.CLIENT_URL; 
const allowedOrigins = [
  CLIENT_URL,  
  "http://localhost:5173", 
  "http://localhost:4173", 
].filter(Boolean); 

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS error: ${origin} is not allowed`));
    }
  },
  credentials: true // bắt buộc nếu gửi cookie
}));

// === Routes ===
// public
app.use("/api/auth", authRoute);

// protected
app.use("/api/users", protectedRoute, userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

// === Connect DB & start server ===
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server chạy trên cổng localhost:${PORT}`));
});
