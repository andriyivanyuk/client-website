import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveryService {
  private apiUrl = 'http://localhost:5500/api/client';

  readonly http = inject(HttpClient);

  public getBranches(cityRef: string): Observable<any> {
    let params = new HttpParams();
    if (cityRef) {
      params = params.set('cityRef', cityRef);
    }
    return this.http.get<any>(`${this.apiUrl}/getBranches`, { params });
  }

  public getCities(search: string): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('q', search);
    }
    return this.http.get<any>(`${this.apiUrl}/cities`, { params });
  }
}
