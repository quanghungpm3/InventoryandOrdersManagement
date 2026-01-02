export interface Product {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  imageId?: string;
  createdAt?: string;
  updatedAt?: string;
}
