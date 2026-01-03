import type { User } from "./user";
import type { Product } from "./product";
import type { Order } from "./order";

/*  AUTH  */

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}

/*  PRODUCT  */

export interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;

  fetchProducts: () => Promise<void>;
  fetchMyProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;

  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, data: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  clearProduct: () => void;
}

/*  ORDER  */
export interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;

  createOrder: (
    items: { productId: string; quantity: number }[],
    nameOrder: string,
    description?: string
  ) => Promise<void>;

  updateOrderStatus: (
    id: string,
    status: "pending" | "completed" | "cancelled"
  ) => Promise<void>;

  deleteOrder: (orderIds: string[]) => Promise<void>;

  clearOrder: () => void;
}
