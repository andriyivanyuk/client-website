import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { HeadingComponent } from '../../../components/heading/heading.component';

import { register } from 'swiper/element/bundle';
register();

import 'photoswipe/style.css';
import PhotoSwipe from 'photoswipe';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MaterialModule, CommonModule, HeadingComponent],
})
export class ProductDetailsComponent {
  title: string = 'Деталі продукту';

  images: string[] = [
    'https://picsum.photos/id/1011/1200/800',
    'https://picsum.photos/id/1015/1200/800',
    'https://picsum.photos/id/1016/1200/800',
    'https://picsum.photos/id/1020/1200/800',
    'https://picsum.photos/id/1021/1200/800',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public openLightbox(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const items = this.images.map((src) => ({
      src,
      width: 1200,
      height: 800,
    }));

    const pswp = new PhotoSwipe({
      dataSource: items,
      index,
    });

    pswp.init();
  }

  public handleActiveId(): void {
    // const productId = this.route.snapshot.paramMap.get('id')!;
    // console.log(+productId);
  }
}
