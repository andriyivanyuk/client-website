import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import 'photoswipe/style.css';
import PhotoSwipe from 'photoswipe';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
})
export class SliderComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  images: string[] = [
    'https://picsum.photos/id/1011/1200/800',
    'https://picsum.photos/id/1015/1200/800',
    'https://picsum.photos/id/1016/1200/800',
    'https://picsum.photos/id/1020/1200/800',
    'https://picsum.photos/id/1021/1200/800',
  ];
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

  ngOnInit() {}
}
