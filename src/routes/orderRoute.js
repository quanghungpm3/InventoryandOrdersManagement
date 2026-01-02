import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tạo order (POST) ✅
router.post("/", protectedRoute, createOrder);

// Lấy danh sách order của user (GET) ✅
router.get("/", protectedRoute, getMyOrders);

// Cập nhật trạng thái order (PUT) ✅
router.put("/:id/status", protectedRoute, updateOrderStatus);

// Xóa nhiều order cùng lúc (DELETE) ✅
router.delete("/", protectedRoute, deleteOrder);

export default router;
