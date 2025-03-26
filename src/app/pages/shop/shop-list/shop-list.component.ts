import { Component, inject, OnInit } from '@angular/core';
import { ShopListItemComponent } from '../shop-list-item/shop-list-item.component';
import { ProductService } from '../../../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { catchError, Subscription } from 'rxjs';
import { MappedProduct } from '../../../models/MappedProduct';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MaterialModule } from '../../../modules/material.module';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shop-list',
  imports: [
    ShopListItemComponent,
    HeadingComponent,
    MaterialModule,
    NgxSpinnerModule,
  ],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  providers: [ProductService, NgxSpinnerService],
})
export class ShopListComponent implements OnInit {
  title: string = 'Товари';
  form!: FormGroup;

  private subscriptions: Subscription = new Subscription();

  totalProducts = 0;
  page = 1;
  limit = 20;

  isLoaded: boolean = false;
  productIsAvailable: boolean = false;

  dataSource = new MatTableDataSource<any>();

  readonly spinner = inject(NgxSpinnerService);
  readonly fb = inject(FormBuilder);
  readonly productService = inject(ProductService);

  public createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
    });
  }
  products: MappedProduct[] = [];

  ngOnInit(): void {
    this.createForm();
    this.getProducts();
  }

  public handleRefresh(): void {
    this.getProducts();
  }

  public getProducts(value: string = ''): void {
    this.spinner.show();
    this.isLoaded = false;
    const subscription = this.productService
      .getProducts(this.page, this.limit, value)
      .pipe(
        catchError((error) => {
          throw 'error in getting products: ' + error;
        })
      )
      .subscribe({
        next: (result) => {
          const products = this.productService.mapProducts(result.products);
          this.products = products;

          this.totalProducts = products.length;
          if (result) {
            this.spinner.hide();
            this.isLoaded = true;
          } else {
            this.isLoaded = false;
          }
          if (!!result.products.length) {
            this.productIsAvailable = true;
          } else {
            this.productIsAvailable = false;
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    this.subscriptions.add(subscription);
  }

  public onPageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getProducts();
  }
}
