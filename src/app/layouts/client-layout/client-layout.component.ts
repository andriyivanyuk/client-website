import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, MaterialModule, HeaderComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss',
})
export class ClientLayoutComponent {}
