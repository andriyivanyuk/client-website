import { Component, inject, Input } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { MappedProduct } from '../../../models/MappedProduct';

@Component({
  selector: 'app-shop-list-item',
  imports: [MaterialModule],
  templateUrl: './shop-list-item.component.html',
  styleUrl: './shop-list-item.component.scss',
  providers: [ProductService],
})
export class ShopListItemComponent {
  @Input() product!: MappedProduct;

  readonly cartService = inject(CartService);

  public addToCart(product: MappedProduct) {
    this.cartService.selectProduct(product);
  }
}
