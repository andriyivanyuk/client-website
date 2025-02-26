import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = new BehaviorSubject<any[]>([]);

  public getProducts() {
    return this.products.asObservable();
  }

  public addProduct(product: any) {
    const uniqueProductsMap = new Map();

    const currentValue = this.products.value;
    this.products.next([...currentValue, product]);

    this.products.value.forEach((product) => {
      uniqueProductsMap.set(product.name, product);
    });

    const uniqueProducts = Array.from(uniqueProductsMap.values());
    this.products.next(uniqueProducts);
    console.log(this.products.value);
  }
}
