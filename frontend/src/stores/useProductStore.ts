import { create } from "zustand";
import { toast } from "sonner";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;

  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, data: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  product: null,
  loading: false,

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const products = await productService.fetchMyProducts();
      set({ products });
    } catch (error) {
      console.error(error);
      toast.error("Lấy danh sách sản phẩm thất bại");
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ loading: true });
      const product = await productService.fetchProductById(id);
      set({ product });
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được chi tiết sản phẩm");
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (data) => {
    try {
      set({ loading: true });
      const product = await productService.createProduct(data);
      set({ products: [product, ...get().products] });
      toast.success("Tạo sản phẩm thành công");
    } catch (error) {
      console.error(error);
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({ loading: true });
      const updated = await productService.updateProduct(id, data);
      set({
        products: get().products.map((p) =>
          p._id === id ? updated : p
        ),
        product: updated,
      });
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật sản phẩm thất bại");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      await productService.deleteProduct(id);
      set({
        products: get().products.filter((p) => p._id !== id),
      });
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error(error);
      toast.error("Xóa sản phẩm thất bại");
    } finally {
      set({ loading: false });
    }
  },

  clearProduct: () => set({ product: null }),
}));
