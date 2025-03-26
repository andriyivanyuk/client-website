import { Component, OnInit } from '@angular/core';
import { HeadingComponent } from '../../components/heading/heading.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [HeadingComponent],
})
export class ContactComponent implements OnInit {
  title: string = 'Наші контакти';
  constructor() {}

  ngOnInit() {}
}
