import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-heading-profile',
  imports: [MaterialModule],
  templateUrl: './heading-profile.component.html',
  styleUrl: './heading-profile.component.scss',
  providers: [],
})
export class HeadingProfileComponent implements OnInit {
  @Input() title!: string;
  ngOnInit(): void {}
}
