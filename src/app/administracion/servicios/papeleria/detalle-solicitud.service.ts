import { Injectable } from '@angular/core';
import { Detalle_solicitud } from '../../modelos/papeleria/detalle_solicitud';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleSolicitudService {
  private urlEndPoint: string = 'http://localhost:8080/api/detalle_solicitud';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(detalle_solicitud: Detalle_solicitud): Observable<Detalle_solicitud>
  {
      return this.http.post<Detalle_solicitud>(this.urlEndPoint, detalle_solicitud, {headers: this.httpHeaders})
  }

  public update(detalle_solicitud: Detalle_solicitud[], id_solicitud: number): Observable<Detalle_solicitud[]>
  {
    return this.http.put<Detalle_solicitud[]>(`${this.urlEndPoint}/${id_solicitud}`, detalle_solicitud, {headers: this.httpHeaders})
  }

  public getDetallesSolicitud(id): Observable<Detalle_solicitud[]>
  {
    return this.http.get<Detalle_solicitud[]>(`${this.urlEndPoint}/${id}`);
  }


}