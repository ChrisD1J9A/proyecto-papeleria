import { Injectable } from '@angular/core';
import { Detalle_compra_pfdc } from '../../modelos/papeleria/detalle_compra_PFDC';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraPFDCService {
  private urlEndPoint: string = environment.apiUrl + 'detalle_compra_pfdc';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crean detalles de compra con productos fuera del catalogo en la base de datos
   **/
  public create(detalle_compra: Detalle_compra_pfdc): Observable<Detalle_compra_pfdc>
  {
      return this.http.post<Detalle_compra_pfdc>(this.urlEndPoint, detalle_compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se actulizan los detalles de compra con productos fuera del catalogo en la base de datos
   **/
  public update(detalle_compra_pfdc: Detalle_compra_pfdc[], id_compra: number): Observable<Detalle_compra_pfdc[]>
  {
    return this.http.put<Detalle_compra_pfdc[]>(`${this.urlEndPoint}/${id_compra}`, detalle_compra_pfdc, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen todo detalles de compra con productos fuera del catalogo en la base de datos mediante el id_compra
   **/
  public getDetallesCompra_pfdc(id): Observable<Detalle_compra_pfdc[]>
  {
    return this.http.get<Detalle_compra_pfdc[]>(`${this.urlEndPoint}/${id}`);
  }
}
