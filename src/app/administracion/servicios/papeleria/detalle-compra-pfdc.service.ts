import { Injectable } from '@angular/core';
import { Detalle_compra_PFDC } from '../../modelos/papeleria/detalle_compra_PFDC';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraPFDCService {
  private urlEndPoint: string = 'http://localhost:8080/api/detalle_compra_PFDC';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(detalle_compra: Detalle_compra_PFDC): Observable<Detalle_compra_PFDC>
  {
      return this.http.post<Detalle_compra_PFDC>(this.urlEndPoint, detalle_compra, {headers: this.httpHeaders})
  }

  public update(detalle_compra_PFDC: Detalle_compra_PFDC[], id_compra: number): Observable<Detalle_compra_PFDC[]>
  {
    return this.http.put<Detalle_compra_PFDC[]>(`${this.urlEndPoint}/${id_compra}`, detalle_compra_PFDC, {headers: this.httpHeaders})
  }

  public getDetallesCompra_PFDC(id): Observable<Detalle_compra_PFDC[]>
  {
    return this.http.get<Detalle_compra_PFDC[]>(`${this.urlEndPoint}/${id}`);
  }
}
