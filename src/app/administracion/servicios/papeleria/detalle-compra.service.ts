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

  /**
   **@return Se crean detalles de compra en la base de datos
   **/
  public create(detalle_compra: Detalle_compra): Observable<Detalle_compra>
  {
      return this.http.post<Detalle_compra>(this.urlEndPoint, detalle_compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se actualizan detalles de compra en la base de datos
   **/
  public update(detalle_compra: Detalle_compra[], id_compra: number): Observable<Detalle_compra[]>
  {
    return this.http.put<Detalle_compra[]>(`${this.urlEndPoint}/${id_compra}`, detalle_compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen los detalles de compra en la base de datos mediante el id_compra
   **/
  public getDetallesCompra(id): Observable<Detalle_compra[]>
  {
    return this.http.get<Detalle_compra[]>(`${this.urlEndPoint}/${id}`);
  }
}
