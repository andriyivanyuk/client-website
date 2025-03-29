import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MappedProduct } from '../models/mappedProduct';
import { environment } from '../../environments/environment';
import {
  Product,
  ProductImage,
  ProductResponse,
} from '../models/productResponse';

@Injectable()
export class ProductService {
  private apiUrl = 'http://localhost:5500/api/client';

  private r2PublicDomain =
    'https://pub-f2a1168bcc8267043d925c14d7a08960.r2.dev';
  private workerDomain = 'https://r2-proxy-worker.andriyivvanyuk.workers.dev';

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

    const headers = new HttpHeaders().set('X-Store-ID', environment.storeId);

    return this.http
      .get<ProductResponse>(`${this.apiUrl}/products`, { params, headers })
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

  public getProductById(id: number): Observable<Product> {
    const headers = new HttpHeaders().set('X-Store-ID', environment.storeId);

    return this.http
      .get<Product>(`${this.apiUrl}/product/${id}`, { headers })
      .pipe(
        map((result) => {
          if (result && result.images) {
            result.images = result.images.map((image: ProductImage) => ({
              ...image,
              fullPath: `http://localhost:5500/${image.image_path}`,
            }));
          }
          return result;
        })
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
        fullPath: this.replaceDomain(primaryImage.image_path),
        quantity: product.quantity || null,
      };
    });
  }

  public replaceDomain(imagePath: string): string {
    return imagePath.replace(this.r2PublicDomain, this.workerDomain);
  }
}
