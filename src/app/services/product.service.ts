import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ProductImage, ProductResponse } from '../models/ProductResponse';
import { MappedProduct } from '../models/MappedProduct';

@Injectable()
export class ProductService {
  private apiUrl = 'http://localhost:5500/api/client';

  constructor(private http: HttpClient) {}

  public getProducts(
    page: number,
    limit: number,
    search: string = ''
  ): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<ProductResponse>(`${this.apiUrl}/products`, { params })
      .pipe(
        map((result) => ({
          total: result.total,
          page: result.page,
          limit: result.limit,
          products: result.products.map((product) => ({
            ...product,
            images: product.images?.map((image: ProductImage) => ({
              ...image,
              fullPath: `http://localhost:5500/${image.image_path}`,
            })),
          })),
        }))
      );
  }

  public mapProducts(products: any[]): MappedProduct[] {
    return products.map((product) => {
      const primaryImage = product?.images?.find(
        (image: ProductImage) => image.is_primary === true
      );
      return {
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        status_name: product.status_name,
        fullPath: primaryImage ? primaryImage.fullPath : null,
        quantity: product.quantity || null,
      };
    });
  }
}
