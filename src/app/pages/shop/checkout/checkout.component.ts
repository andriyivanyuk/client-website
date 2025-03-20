import { Component, inject, OnInit } from '@angular/core';
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

import { DeliveryService } from '../../../services/delivery.service';
import {
  catchError,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '../../../models/cartItem';
import { HeadingComponent } from '../../../components/heading/heading.component';

@Component({
  selector: 'app-checkout',
  imports: [
    MaterialModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HeadingComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  providers: [OrderService, DeliveryService],
})
export class CheckoutComponent implements OnInit {
  title: string = 'Оформлення замовлення';
  form!: FormGroup;

  cities: any[] = [];
  branches: any[] = [];
  selectedCity!: string;
  filteredOptions!: Observable<any>;
  isLoading = false;

  readonly fb = inject(FormBuilder);
  readonly loader = inject(NgxUiLoaderService);
  readonly snackBar = inject(MatSnackBar);

  readonly orderService = inject(OrderService);
  readonly cartService = inject(CartService);
  readonly deliveryService = inject(DeliveryService);

  ngOnInit(): void {
    this.createForm();
    this.handleSelectedProducts();
    this.handleCityOptions();
    this.handleBranchFilter();
  }

  public createForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '1234567890',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      items: this.fb.array([], [Validators.required]),
      city: ['', [Validators.required]],
      departmentNumber: ['', [Validators.required]],
      comment: [''],
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  public handleCityOptions(): void {
    this.form.controls['city'].valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.deliveryService.getCities(value).pipe(
            catchError((err) => {
              this.snackBar.open(err.error.message, 'Закрити', {
                duration: 2000,
              });
              this.isLoading = false;
              return of([]);
            })
          )
        )
      )
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          this.cities = result;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public handleBranchFilter(): void {
    this.filteredOptions = this.form.controls[
      'departmentNumber'
    ].valueChanges.pipe(
      debounceTime(300),
      filter(() => !!this.selectedCity),
      map((value) => this._filter(value))
    );
  }

  public onCitySelected(city: MatAutocompleteSelectedEvent): void {
    const ref = this.cities
      .filter((item) => item.Description === city.option.value)
      .find((el) => el.Ref).Ref;

    this.selectedCity = ref;

    this.deliveryService.getBranches(ref).subscribe({
      next: (result) => {
        this.branches = result;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.branches.filter((option) =>
      option.Description.toLowerCase().includes(filterValue)
    );
  }

  public handleSelectedProducts(): void {
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

  get getTotalCost(): number {
    return this.items.value
      .map((t: CartItem) => t.price * t.quantity)
      .reduce((acc: any, value: any) => acc + value, 0);
  }

  public createOrder() {
    if (this.form.valid) {
      this.loader.start();
      const request: OrderRequest = {
        firstName: this.form.controls['firstName'].value,
        lastName: this.form.controls['lastName'].value,
        email: this.form.controls['email'].value,
        phone: this.form.controls['phone'].value,
        items: this.form.controls['items'].value,
        departmentNumber: this.form.controls['departmentNumber'].value,
        city: this.form.controls['city'].value,
        comment: this.form.controls['comment'].value,
      };

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
