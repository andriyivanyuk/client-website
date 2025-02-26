import { Component, inject, Input } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shop-list-item',
  imports: [MaterialModule],
  templateUrl: './shop-list-item.component.html',
  styleUrl: './shop-list-item.component.scss',
  providers: [],
})
export class ShopListItemComponent {
  @Input() product: any;

  readonly productService = inject(ProductService);

  public addToCart(product: any) {
    this.productService.addProduct(product);
  }
}
