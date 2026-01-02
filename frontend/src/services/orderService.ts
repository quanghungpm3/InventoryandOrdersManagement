import axios from "@/lib/axios";
import type { OrderStatus } from "@/types/order";

export const orderService = {
  getMyOrders() {
    return axios.get("/orders");
  },

  getOrderById(id: string) {
    return axios.get(`/orders/${id}`);
  },

  createOrder(items: { productId: string; quantity: number }[], nameOrder: string, description?: string) {
    return axios.post("/orders", { items, nameOrder, description });
  },

  updateOrderStatus(id: string, status: OrderStatus) {
    return axios.put(`/orders/${id}/status`, { status });
  },

  deleteOrders(orderIds: string[]) {
    return axios.delete("/orders", { data: { orderIds } });
  },
};
