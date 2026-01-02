import express from "express";
import {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protectedRoute } from "../middlewares/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  upload.single("image"),
  uploadToCloudinary,
  createProduct
);

router.get("/", protectedRoute, getMyProducts);

router.get("/:id", protectedRoute, getProductById);

router.put(
  "/:id",
  protectedRoute,
  upload.single("image"),
  uploadToCloudinary,
  updateProduct
);

router.delete("/:id", protectedRoute, deleteProduct);

export default router;
