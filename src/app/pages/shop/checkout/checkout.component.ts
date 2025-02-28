import { Component, inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderRequest } from '../../../models/Order';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CartService } from '../../../services/cart.service';
import { HeadingProfileComponent } from '../../../components/heading-profile/heading-profile.component';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  src?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    MaterialModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    HeadingProfileComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [OrderService],
})
export class CheckoutComponent implements OnInit {
  title: string = 'Замовлення товару';
  form!: FormGroup;

  readonly fb = inject(FormBuilder);
  readonly loader = inject(NgxUiLoaderService);

  readonly orderService = inject(OrderService);
  readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.createForm();
    this.cartService.getSelectedProducts().subscribe({
      next: (items) => {
        items.forEach((item) => {
          const group = this.fb.group({
            title: [item.title],
            product_id: [item.product_id],
            quantity: [item.quantity],
            price: [item.price],
          });
          this.items.push(group);
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '1234567890',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      items: this.fb.array([], [Validators.required]),
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get getTotalCost(): number {
    return this.items.value
      .map((t: CartItem) => t.price * t.quantity)
      .reduce((acc: any, value: any) => acc + value, 0);
  }

  public createOrder() {
    if (this.form.valid) {
      this.loader.start();
      const request: OrderRequest = this.form.value;

      this.orderService.createOrder(request).subscribe({
        next: (response) => {
          console.log('Order created:', response);
          this.loader.stop();
        },
        error: (error) => {
          this.loader.stop();
          console.error('Error creating order:', error);
        },
      });
    }
  }
}
