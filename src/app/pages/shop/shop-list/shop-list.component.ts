import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { ShopListItemComponent } from '../shop-list-item/shop-list-item.component';

@Component({
  selector: 'app-shop-list',
  imports: [ShopListItemComponent],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
})
export class ShopListComponent {
  products = [
    { name: 'Product 1', price: 100 },
    { name: 'Product 2', price: 200 },
    { name: 'Product 3', price: 300 },
    { name: 'Product 3', price: 300 },
    { name: 'Product 3', price: 300 },
    { name: 'Product 3', price: 300 },
  ];
}
