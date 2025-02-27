import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { ProductImage, ProductResponse } from '../models/ProductResponse';
import { MappedProduct } from '../models/MappedProduct';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private selectedProducts = new BehaviorSubject<MappedProduct[]>([]);
  private confirmedProducts = new BehaviorSubject<any[]>([]);

  public getSelectedProducts() {
    return this.selectedProducts.asObservable();
  }

  public getConfirmedProducts() {
    return this.confirmedProducts.pipe(take(1));
  }

  public selectProduct(product: any) {
    const uniqueProductsMap = new Map();

    const currentValue = this.selectedProducts.value;
    this.selectedProducts.next([...currentValue, product]);

    this.selectedProducts.value.forEach((product) => {
      uniqueProductsMap.set(product.title, product);
    });

    const uniqueProducts = Array.from(uniqueProductsMap.values());
    this.selectedProducts.next(uniqueProducts);
  }

  public setConfirmedProducts(products: any) {
    this.confirmedProducts.next(products);
  }
}
