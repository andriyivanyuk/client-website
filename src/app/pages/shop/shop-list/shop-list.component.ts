import { Component, inject, OnInit } from '@angular/core';
import { ShopListItemComponent } from '../shop-list-item/shop-list-item.component';
import { ProductService } from '../../../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { catchError, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MappedProduct } from '../../../models/MappedProduct';
import { HeadingComponent } from '../../../components/heading/heading.component';

@Component({
  selector: 'app-shop-list',
  imports: [ShopListItemComponent, HeadingComponent],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  providers: [ProductService],
})
export class ShopListComponent implements OnInit {
  title: string = 'Товари';
  form!: FormGroup;

  private subscriptions: Subscription = new Subscription();

  totalProducts = 0;
  page = 1;
  limit = 20;

  isLoaded: boolean = false;

  dataSource = new MatTableDataSource<any>();

  readonly fb = inject(FormBuilder);
  readonly productService = inject(ProductService);
  readonly loader = inject(NgxUiLoaderService);

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
    this.loader.start();
    const subscription = this.productService
      .getProducts(this.page, this.limit, value)
      .pipe(
        catchError((error) => {
          this.loader.stop();
          throw 'error in getting products: ' + error;
        })
      )
      .subscribe((result) => {
        this.loader.stop();

        const products = this.productService.mapProducts(result.products);
        this.products = products;
        this.totalProducts = products.length;
        if (result.products.length) {
          this.isLoaded = true;
        } else {
          this.isLoaded = false;
        }
      });
    this.subscriptions.add(subscription);
  }

  public onPageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getProducts();
  }
}
