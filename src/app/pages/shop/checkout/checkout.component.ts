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

interface Item {
  product_id: number;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  imports: [MaterialModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [OrderService],
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;

  readonly fb = inject(FormBuilder);
  readonly loader = inject(NgxUiLoaderService);

  readonly orderService = inject(OrderService);
  readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.createForm();
    this.cartService.getConfirmedProducts().subscribe((res) => {
      res.map((item) => {
        const group = this.fb.group({
          product_id: [item.id],
          quantity: [item.quantity],
          price: [item.price],
        });
        this.items.push(group);
      });
    });
    console.log(this.items);
  }

  public createForm() {
    this.form = this.fb.group({
      title: ['Andriy', [Validators.required]],
      email: ['customer@example.com', [Validators.required, Validators.email]],
      phone: [
        '1234567890',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      items: this.fb.array([]),
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItems(): FormGroup[] {
    return [];
    // const itemsData = [
    //   { product_id: 1, quantity: 2, price: 19.99 },
    //   { product_id: 2, quantity: 1, price: 39.99 },
    // ];

    // return itemsData.map((item) =>
    //   this.fb.group({
    //     product_id: [item.product_id, Validators.required],
    //     quantity: [item.quantity, [Validators.required, Validators.min(1)]],
    //     price: [item.price, Validators.required],
    //   })
    // );
  }

  public createOrder() {
    if (this.form.valid) {
      this.loader.start();
      const request: OrderRequest = this.form.value;

      console.log(request);

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
