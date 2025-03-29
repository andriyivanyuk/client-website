export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface Product {
  product_id: number;
  title: string;
  description: string;
  price: string;
  stock: number;
  category_id: number;
  created_by_user_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  status_name: string;
  attributes: ProductAttribute[];
  images: ProductImage[];
  product_type: string;
  category_title: string;
  product_code: string;
}

export interface ProductAttribute {
  key: string;
  values: string;
}

export interface ProductImage {
  image_path: string;
  is_primary: boolean;
}
