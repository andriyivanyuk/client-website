import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/Order';

@Injectable()
export class OrderService {
  private apiUrl = 'http://localhost:5500/api/client';

  constructor(private http: HttpClient) {}

  public createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.apiUrl + '/createOrder',
      orderData
    );
  }
}
