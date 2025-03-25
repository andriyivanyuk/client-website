import { Component, inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { MappedProduct } from '../../../models/MappedProduct';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-list-item',
  imports: [MaterialModule, CommonModule],
  templateUrl: './shop-list-item.component.html',
  styleUrl: './shop-list-item.component.scss',
  providers: [ProductService],
})
export class ShopListItemComponent {
  @Input() product!: MappedProduct;

  readonly cartService = inject(CartService);
  readonly router = inject(Router);

  public addToCart(product: MappedProduct, event: MouseEvent): void {
    event.stopPropagation();
    this.cartService.selectProduct(product);
  }

  public productDetails(id: number) {
    console.log(id);
    this.router.navigate(['/client/product-details', id]);
  }
}
