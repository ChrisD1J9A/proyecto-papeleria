import { Injectable } from '@angular/core';
import { Compra } from '../modelos/compra';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private urlEndPoint: string = 'http://localhost:8080/api/compras';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(compra: Compra): Observable<Compra>
  {
      return this.http.post<Compra>(this.urlEndPoint, compra, {headers: this.httpHeaders})
  }

  public  update(compra: Compra): Observable<Compra>
  {
    return this.http.put<Compra>(`${this.urlEndPoint}/${compra.id_compra}`, compra, {headers: this.httpHeaders})
  }

  getCompras(): Observable<Compra[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Compra[])
    );
  }

  getCompra(id): Observable<Compra>
  {
    return this.http.get<Compra>(`${this.urlEndPoint}/${id}`);
  }
}
