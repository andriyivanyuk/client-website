import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { HeadingComponent } from '../../components/heading/heading.component';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, HeadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  title: string = 'Головна';
}
