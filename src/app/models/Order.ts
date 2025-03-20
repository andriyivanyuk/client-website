export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  departmentNumber: string;
  city: string;
  comment: string;
}

export interface OrderResponse {
  message: string;
  orderId: number;
}
