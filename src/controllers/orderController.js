import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order phải có ít nhất 1 sản phẩm",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          message: "productId không hợp lệ",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ số lượng`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({
      message: "Lỗi khi tạo đơn hàng",
    });
  }
};



export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res.status(500).json({ message: "Không thể lấy danh sách đơn hàng" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ message: "Không thể cập nhật trạng thái" });
  }
};




