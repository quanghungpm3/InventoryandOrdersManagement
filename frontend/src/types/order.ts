export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  _id: string;
  userId: string;
  nameOrder: string;
  description?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}
