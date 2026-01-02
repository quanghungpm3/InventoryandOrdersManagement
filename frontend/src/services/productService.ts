import api from "@/lib/axios";
import type { Product } from "@/types/product";

export const productService = {
  // Lấy sản phẩm của user hiện tại
  fetchMyProducts: async (): Promise<Product[]> => {
    const res = await api.get("/products");
    return res.data; // backend trả thẳng array
  },

  // Lấy chi tiết sản phẩm
  fetchProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  // Tạo sản phẩm
  createProduct: async (data: FormData): Promise<Product> => {
    const res = await api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: string, data: FormData): Promise<Product> => {
    const res = await api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
