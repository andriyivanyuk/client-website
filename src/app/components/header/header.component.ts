import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  imports: [MaterialModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [],
})
export class HeaderComponent implements OnInit {
  itemCount: number = 0;

  readonly productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.itemCount = products.length;
    });
  }
}
