import { Injectable } from '@angular/core';
import { Detalle_solicitud_pfdc } from '../../modelos/papeleria/detalle_solicitud_PFDC';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleSolicitudPFDCService {
  private urlEndPoint: string = environment.apiUrl + 'detalle_solicitud_pfdc';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crea detalles de solicitud con productos fuera del catalogo en la base de datos
   **/
  public create(detalle_solicitud: Detalle_solicitud_pfdc): Observable<Detalle_solicitud_pfdc>
  {
      return this.http.post<Detalle_solicitud_pfdc>(this.urlEndPoint, detalle_solicitud, {headers: this.httpHeaders})
  }

  /**
   **@return Se actualiza detalles de solicitud con productos fuera del catalogo en la base de datos
   **/
  public update(detalle_solicitud_pfdc: Detalle_solicitud_pfdc[], id_solicitud: number): Observable<Detalle_solicitud_pfdc[]>
  {
    return this.http.put<Detalle_solicitud_pfdc[]>(`${this.urlEndPoint}/${id_solicitud}`, detalle_solicitud_pfdc, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen todos detalles de solicitud con productos fuera del catalogo mediante el id de la solicitud
   **/
  public getDetallesSolicitud_pfdc(id): Observable<Detalle_solicitud_pfdc[]>
  {
    return this.http.get<Detalle_solicitud_pfdc[]>(`${this.urlEndPoint}/${id}`);
  }

  /**
   **@return Devuelve todos los detalles de solicitud con productos fuera del catalogo disponibles en la base de datos
   **/
  public getDetallesSolicitud_pfdc_All(): Observable<Detalle_solicitud_pfdc[]>
  {
    return this.http.get<Detalle_solicitud_pfdc[]>(`${this.urlEndPoint}`);
  }
}
