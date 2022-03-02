import { Injectable } from '@angular/core';
import { Detalle_compra } from '../../modelos/papeleria/detalle_compra';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraService {
  private urlEndPoint: string = 'http://localhost:8080/api/detalle_compra';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(detalle_compra: Detalle_compra): Observable<Detalle_compra>
  {
      return this.http.post<Detalle_compra>(this.urlEndPoint, detalle_compra, {headers: this.httpHeaders})
  }

  public update(detalle_compra: Detalle_compra[], id_compra: number): Observable<Detalle_compra[]>
  {
    return this.http.put<Detalle_compra[]>(`${this.urlEndPoint}/${id_compra}`, detalle_compra, {headers: this.httpHeaders})
  }

  public getDetallesCompra(id): Observable<Detalle_compra[]>
  {
    return this.http.get<Detalle_compra[]>(`${this.urlEndPoint}/${id}`);
  }
}
