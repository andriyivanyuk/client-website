import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, MaterialModule, HeaderComponent, CommonModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss',
  providers: [ProductService],
})
export class ClientLayoutComponent {}
