import mongoose from "mongoose";
import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file?.path;

    if (!name || price == null || stock == null || !image) {
      return res.status(400).json({
        message: "Thiếu name, price, stock hoặc image",
      });
    }

    const product = await Product.create({
      userId: req.user._id,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Lỗi createProduct", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi getMyProducts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi getProductById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const { name, description, price, stock } = req.body;
    const image = req.file?.path;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (image) product.image = image;

    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error("Lỗi updateProduct", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi deleteProduct", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
