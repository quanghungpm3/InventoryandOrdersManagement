import { create } from "zustand";
import { toast } from "sonner";
import { orderService } from "@/services/orderService";
import type { OrderState } from "@/types/store";

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  order: null,
  loading: false,

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const res = await orderService.getMyOrders();
      set({ orders: res.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lấy danh sách đơn hàng thất bại");
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    try {
      set({ loading: true });
      const res = await orderService.getOrderById(id);
      set({ order: res.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không lấy được chi tiết đơn hàng");
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (items, nameOrder, description) => {
    try {
      set({ loading: true });
      const res = await orderService.createOrder(items, nameOrder, description);
      set((state) => ({ orders: [res.data, ...state.orders] }));
      toast.success("Tạo đơn hàng thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Tạo đơn hàng thất bại");
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      set({ loading: true });
      await orderService.updateOrderStatus(id, status);
      toast.success("Cập nhật đơn hàng thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật đơn hàng thất bại");
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (orderIds: string[]) => {
    try {
      set({ loading: true });
      await orderService.deleteOrders(orderIds);
      set((state) => ({
        orders: state.orders.filter((order) => !orderIds.includes(order._id)),
      }));
      toast.success("Xóa đơn hàng thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Xóa đơn hàng thất bại");
    } finally {
      set({ loading: false });
    }
  },

  clearOrder: () => set({ order: null }),
}));
