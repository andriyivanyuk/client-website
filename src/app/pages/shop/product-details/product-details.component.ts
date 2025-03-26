import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { HeadingComponent } from '../../../components/heading/heading.component';

import { register } from 'swiper/element/bundle';
register();

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MaterialModule, CommonModule, HeadingComponent],
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  title: string = 'Деталі продукту';

  productImages: string[] = [
    'https://picsum.photos/id/1011/1200/800',
    'https://picsum.photos/id/1015/1200/800',
    'https://picsum.photos/id/1016/1200/800',
    'https://picsum.photos/id/1020/1200/800',
    'https://picsum.photos/id/1021/1200/800',
  ];

  selectedImage: string = this.productImages[0];
  selectedImageIndex: number = 0;
  private lightbox!: PhotoSwipeLightbox;
  isBrowser: boolean;

  @ViewChild('thumbsSwiper', { static: false }) thumbsSwiper?: ElementRef;
  @ViewChild('nextEl', { static: false }) nextEl?: ElementRef;
  @ViewChild('prevEl', { static: false }) prevEl?: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      import('photoswipe/lightbox').then(({ default: PhotoSwipeLightbox }) => {
        this.lightbox = new PhotoSwipeLightbox({
          gallery: '.gallery-container',
          children: '.main-slide-img',
          pswpModule: () => import('photoswipe'),
        });

        this.lightbox.addFilter('itemData', (_, index) => ({
          src: this.productImages[index],
          width: 1200,
          height: 800,
        }));

        this.lightbox.init();
      });
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser && this.thumbsSwiper) {
      const swiperEl = this.thumbsSwiper.nativeElement;

      await swiperEl.swiper;

      setTimeout(() => this.updateActiveThumbnail(), 0);
    }
  }

  selectImage(index: number): void {
    this.selectedImage = this.productImages[index];
    this.selectedImageIndex = index;
    if (this.isBrowser) {
      this.updateActiveThumbnail();
    }
  }

  openGallery(index: number): void {
    if (this.isBrowser && this.lightbox) {
      this.lightbox.loadAndOpen(index);
    }
  }

  private updateActiveThumbnail(): void {
    if (this.thumbsSwiper && this.thumbsSwiper.nativeElement.swiper) {
      const slides =
        this.thumbsSwiper.nativeElement.querySelectorAll('swiper-slide');
      slides.forEach((slide: HTMLElement, idx: number) => {
        slide.classList.toggle('active', idx === this.selectedImageIndex);
      });
      this.thumbsSwiper.nativeElement.swiper.slideTo(this.selectedImageIndex);
    }
  }

  public handleActiveId(): void {
    // const productId = this.route.snapshot.paramMap.get('id')!;
    // console.log(+productId);
  }
}
