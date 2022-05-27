import { Injectable } from '@angular/core';
import { Detalle_compra_PFDC } from '../../modelos/papeleria/detalle_compra_PFDC';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraPFDCService {
  private urlEndPoint: string = environment.apiUrl + 'detalle_compra_PFDC';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crean detalles de compra con productos fuera del catalogo en la base de datos
   **/
  public create(detalle_compra: Detalle_compra_PFDC): Observable<Detalle_compra_PFDC>
  {
      return this.http.post<Detalle_compra_PFDC>(this.urlEndPoint, detalle_compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se actulizan los detalles de compra con productos fuera del catalogo en la base de datos
   **/
  public update(detalle_compra_PFDC: Detalle_compra_PFDC[], id_compra: number): Observable<Detalle_compra_PFDC[]>
  {
    return this.http.put<Detalle_compra_PFDC[]>(`${this.urlEndPoint}/${id_compra}`, detalle_compra_PFDC, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen todo detalles de compra con productos fuera del catalogo en la base de datos mediante el id_compra
   **/
  public getDetallesCompra_PFDC(id): Observable<Detalle_compra_PFDC[]>
  {
    return this.http.get<Detalle_compra_PFDC[]>(`${this.urlEndPoint}/${id}`);
  }
}
