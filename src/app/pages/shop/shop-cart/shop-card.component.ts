import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterLink } from '@angular/router';
import { MappedProduct } from '../../../models/MappedProduct';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, take } from 'rxjs';
import { HeadingProfileComponent } from '../../../components/heading-profile/heading-profile.component';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  src?: string;
}

@Component({
  selector: 'app-shop-cart',
  imports: [MaterialModule, RouterLink, CommonModule, HeadingProfileComponent],
  templateUrl: './shop-card.component.html',
  styleUrl: './shop-card.component.scss',
  providers: [],
})
export class ShopCardComponent implements OnInit, OnDestroy {
  title: string = 'Кошик';

  private subscription!: Subscription;

  displayedColumns: string[] = [
    'title',
    'price',
    'quantity',
    'total',
    'actions',
  ];

  dataSource = new MatTableDataSource<CartItem>();

  readonly cartService = inject(CartService);
  readonly loader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.getSelectedProducts();
  }

  public getSelectedProducts() {
    this.subscription = this.cartService
      .getSelectedProducts()
      .subscribe((result) => {
        const selectedProducts = result.map((item) => {
          return {
            id: item.product_id,
            title: item.title,
            price: +item.price,
            quantity: item.quantity,
            src: item.fullPath,
          };
        });

        this.dataSource.data = selectedProducts;
      });
  }

  get getTotalCost(): number {
    return this.dataSource.data
      .map((t: CartItem) => t.price * t.quantity)
      .reduce((acc: any, value: any) => acc + value, 0);
  }

  public updateQuantity(item: CartItem, change: number): void {
    this.cartService.updateQuantity(item.id, change);
  }

  public removeItem(item: CartItem): void {
    this.cartService.removeProduct(item.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
