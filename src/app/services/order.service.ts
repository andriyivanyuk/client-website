import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/Order';
import { environment } from '../../environments/environment';

@Injectable()
export class OrderService {
  private apiUrl = 'http://localhost:5500/api/client';

  readonly http = inject(HttpClient);

  public createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    const headers = new HttpHeaders().set('X-Store-ID', environment.storeId);
    return this.http.post<OrderResponse>(
      `${this.apiUrl}/createOrder`,
      orderData,
      { headers }
    );
  }
}
