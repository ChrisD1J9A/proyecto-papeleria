import { Injectable } from '@angular/core';
import { Detalle_solicitud_PFDC } from '../../modelos/papeleria/detalle_solicitud_PFDC';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleSolicitudPFDCService {
  private urlEndPoint: string = 'http://localhost:8080/api/detalle_solicitud_PFDC';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(detalle_solicitud: Detalle_solicitud_PFDC): Observable<Detalle_solicitud_PFDC>
  {
      return this.http.post<Detalle_solicitud_PFDC>(this.urlEndPoint, detalle_solicitud, {headers: this.httpHeaders})
  }

  public update(detalle_solicitud_PFDC: Detalle_solicitud_PFDC[], id_solicitud: number): Observable<Detalle_solicitud_PFDC[]>
  {
    return this.http.put<Detalle_solicitud_PFDC[]>(`${this.urlEndPoint}/${id_solicitud}`, detalle_solicitud_PFDC, {headers: this.httpHeaders})
  }

  public getDetallesSolicitud_PFDC(id): Observable<Detalle_solicitud_PFDC[]>
  {
    return this.http.get<Detalle_solicitud_PFDC[]>(`${this.urlEndPoint}/${id}`);
  }
}
