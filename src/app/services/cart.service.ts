import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { MappedProduct } from '../models/MappedProduct';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private selectedProducts = new BehaviorSubject<MappedProduct[]>([]);

  public getSelectedProducts() {
    return this.selectedProducts.asObservable();
  }
  public selectProduct(product: MappedProduct) {
    this.selectedProducts
      .pipe(
        take(1),
        map((currentProducts) => {
          const uniqueProductsMap = new Map<number, MappedProduct>();

          currentProducts.forEach((prod) =>
            uniqueProductsMap.set(prod.product_id, prod)
          );
          uniqueProductsMap.set(product.product_id, product);
          return Array.from(uniqueProductsMap.values());
        })
      )
      .subscribe((uniqueProducts) => {
        this.selectedProducts.next(uniqueProducts);
      });
  }

  public removeProduct(productId: number) {
    this.selectedProducts
      .pipe(
        take(1),
        map((products) =>
          products.filter((product) => product.product_id !== productId)
        )
      )
      .subscribe((filteredProducts) => {
        this.selectedProducts.next(filteredProducts);
      });
  }
}
