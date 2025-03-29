import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { MappedProduct } from '../models/mappedProduct';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private selectedProducts = new BehaviorSubject<MappedProduct[]>([]);

  public getSelectedProducts() {
    return this.selectedProducts.asObservable();
  }

  public updateQuantity(productId: number, change: number) {
    this.selectedProducts
      .pipe(
        take(1),
        map((products) => {
          const index = products.findIndex(
            (product) => product.product_id === productId
          );
          if (index !== -1) {
            const updatedProduct = products[index];
            const newQuantity = updatedProduct.quantity + change;
            if (newQuantity > 0) {
              updatedProduct.quantity = newQuantity;
            } else {
              products.splice(index, 1);
            }
          }
          return products;
        })
      )
      .subscribe((updatedProducts) => {
        this.selectedProducts.next(updatedProducts);
      });
  }

  public selectProduct(product: MappedProduct) {
    this.selectedProducts
      .pipe(
        take(1),
        map((currentProducts) => {
          const index = currentProducts.findIndex(
            (p) => p.product_id === product.product_id
          );
          if (index !== -1) {
            currentProducts[index].quantity += 1;
          } else {
            product.quantity = 1;
            currentProducts.push(product);
          }
          return currentProducts;
        })
      )
      .subscribe((updatedProducts) => {
        this.selectedProducts.next(updatedProducts);
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
