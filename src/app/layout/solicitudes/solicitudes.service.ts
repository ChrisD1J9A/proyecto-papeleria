import { Injectable } from '@angular/core';
import { Solicitud } from './solicitud';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private urlEndPoint: string = 'http://localhost:8080/api/solicitudes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }


  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Solicitud[])
    );
  }

  getSolicitud(id): Observable<Solicitud>
  {
    return this.http.get<Solicitud>(`${this.urlEndPoint}/${id}`);
  }
}
