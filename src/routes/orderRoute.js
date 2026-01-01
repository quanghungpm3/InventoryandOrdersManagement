import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectedRoute, createOrder);
router.get("/", protectedRoute, getMyOrders);
router.put("/:id/status", protectedRoute, updateOrderStatus);

export default router;
