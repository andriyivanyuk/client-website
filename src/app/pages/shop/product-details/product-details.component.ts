import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { MaterialModule } from '../../../modules/material.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { HeadingComponent } from '../../../components/heading/heading.component';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CalculatePriceService } from '../../../services/calculate-price.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { SliderComponent } from "../slider/slider.component";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    HeadingComponent,
    ReactiveFormsModule,
    SliderComponent
],
  providers: [CalculatePriceService, ProductService],
})
export class ProductDetailsComponent implements OnInit {
  title: string = 'Деталі продукту';

  selectedValues: { [key: string]: WritableSignal<number> } = {};

  differences: { [key: string]: Signal<{ [value: number]: number }> } = {};

  private fb = inject(FormBuilder);
  public calculatePriceService = inject(CalculatePriceService);
  private productService = inject(ProductService);

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.handleActiveId();
  }

  selectOption(parameterKey: string, value: number): void {
    this.selectedValues[parameterKey].set(value);
  }

  public handleActiveId(): void {
    const productId = this.route.snapshot.paramMap.get('id')!;
    this.getProductDetails(+productId);
  }

  public getProductDetails(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (result) => {
        this.calculatePriceService.initParameterConfigs(result.attributes);
        this.calculatePriceService.parameterConfigs.forEach((config) => {
          this.selectedValues[config.key] = signal(config.options[0].value);

          this.differences[config.key] = computed(
            (): { [value: number]: number } => {
              const selected = this.selectedValues[config.key]();
              const diffMapping: { [value: number]: number } = {};
              config.options.forEach((option) => {
                if (option.value !== selected) {
                  diffMapping[option.value] =
                    this.calculatePriceService.computeDifference(
                      config.key,
                      selected,
                      option.value
                    );
                }
              });
              return diffMapping;
            }
          );
        });
        this.calculatePriceService.updatePrice('Висота, мм', 2100, 0);
        this.calculatePriceService.updatePrice('Висота, мм', 2400, 720);
        this.calculatePriceService.updatePrice('Висота, мм', 2500, 1015);
        this.calculatePriceService.updatePrice('Висота, мм', 2600, 1300);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
