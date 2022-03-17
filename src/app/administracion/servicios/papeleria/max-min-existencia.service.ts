import { Injectable } from '@angular/core';
import {MaxMinDeExistencia} from '../../modelos/papeleria/maxMinDeExistencia';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaxMinExistenciaService {
  private urlEndPoint:string = 'http://localhost:8080/api/maxMinExistencia';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getMaxMinDeExistenciaA(): Observable<MaxMinDeExistencia[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as MaxMinDeExistencia[])
    );
  }

  public create(maxMin: MaxMinDeExistencia): Observable<MaxMinDeExistencia>
  {
      return this.http.post<MaxMinDeExistencia>(this.urlEndPoint, maxMin, {headers: this.httpHeaders})
  }

  public getMaxMinDeExistencia(id): Observable<MaxMinDeExistencia>
  {
    return this.http.get<MaxMinDeExistencia>(`${this.urlEndPoint}/${id}`);
  }

  public update(maxMin: MaxMinDeExistencia): Observable<MaxMinDeExistencia>
  {
    return this.http.put<MaxMinDeExistencia>(`${this.urlEndPoint}/${maxMin.id_maxMinDeExistencia}`, maxMin, {headers: this.httpHeaders});

  }
}
