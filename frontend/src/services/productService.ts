import api from "@/lib/axios";
import type { Product } from "@/types/product";

export const productService = {

  fetchMyProducts: async (): Promise<Product[]> => {
    const res = await api.get("/products");
    return res.data; 
  },

  fetchProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data: FormData): Promise<Product> => {
    const res = await api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateProduct: async (id: string, data: FormData): Promise<Product> => {
    const res = await api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
