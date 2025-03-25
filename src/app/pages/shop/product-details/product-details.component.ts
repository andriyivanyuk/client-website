import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from '../../../components/heading/heading.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  imports: [MaterialModule, CommonModule, HeadingComponent, RouterLink],
})
export class ProductDetailsComponent implements OnInit {
  title: string = 'Деталі продукту';
  readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.handleActiveId();
  }

  public handleActiveId(): void {
    const productId = this.route.snapshot.paramMap.get('id')!;
    console.log(+productId);
  }
}
