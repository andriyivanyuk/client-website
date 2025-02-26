import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShopListComponent } from './pages/shop/shop-list/shop-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'client/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      { path: 'shop-list', component: ShopListComponent },
    ],
  },

  //   {
  //     path: '**',
  //     component: NotFoundComponent,
  //   },
];
