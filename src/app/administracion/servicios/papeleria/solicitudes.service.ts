import { Injectable } from '@angular/core';
import { Solicitud } from '../../modelos/papeleria/solicitud';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private urlEndPoint: string = 'http://localhost:8080/api/solicitudes';
  //private urlEndPoint2: string = 'http://localhost:8080/api/solicitudesDet';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(solicitud: Solicitud): Observable<Solicitud>
  {
      return this.http.post<Solicitud>(this.urlEndPoint, solicitud, {headers: this.httpHeaders})
  }

  public  update(solicitud: Solicitud): Observable<Solicitud>
  {
    return this.http.put<Solicitud>(`${this.urlEndPoint}/${solicitud.id_solicitud}`, solicitud, {headers: this.httpHeaders})
  }

  /*public create(solicitud: Solicitud, detalles: any): Observable<any>
  {
      //const params = new HttpParams().set('detalles', detalles);
      return this.http.post<any>(this.urlEndPoint2, solicitud, {params: new HttpParams({ fromObject: detalles}) , headers: this.httpHeaders});
  }*/


  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Solicitud[])
    );
  }

  getSolicitudesBySucursal(id): Observable<Solicitud[]>
  {
    return this.http.get<Solicitud[]>(`${this.urlEndPoint}/sucursal/${id}`);
  }

  getSolicitud(id): Observable<Solicitud>
  {
    return this.http.get<Solicitud>(`${this.urlEndPoint}/${id}`);
  }
}
