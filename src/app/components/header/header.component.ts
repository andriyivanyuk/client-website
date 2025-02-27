import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [MaterialModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [],
})
export class HeaderComponent implements OnInit {
  itemCount: number = 0;

  readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.cartService.getSelectedProducts().subscribe((products) => {
      this.itemCount = products.length;
    });
  }
}
