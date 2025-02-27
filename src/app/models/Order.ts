export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  title: string;
  email: string;
  phone: string;
  items: OrderItem[];
}

export interface OrderResponse {
  message: string;
  orderId: number;
}
