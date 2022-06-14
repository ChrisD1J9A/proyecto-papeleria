import { Injectable } from '@angular/core';
import {MaxMinDeExistencia} from '../../modelos/papeleria/maxMinDeExistencia';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaxMinExistenciaService {
  private urlEndPoint:string = environment.apiUrl + 'maxMinExistencia';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  /**
   **@return Devuelve todas las configuraciones de la base de datos
   **/
  getMaxMinDeExistenciaA(): Observable<MaxMinDeExistencia[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as MaxMinDeExistencia[])
    );
  }

  /**
   **@return Crea o almacena una nueva configuracion en la base de datos
   **/
  public create(maxMin: MaxMinDeExistencia): Observable<MaxMinDeExistencia>
  {
      return this.http.post<MaxMinDeExistencia>(this.urlEndPoint, maxMin, {headers: this.httpHeaders})
  }

  /**
   **@return Se consulta la configuracion en la base de datos mediante su id
   **/
  public getMaxMinDeExistencia(id): Observable<any>
  {
    return this.http.get(`${this.urlEndPoint}/${id}`);
  }

  /**
   **@return Se busca la configuracion de X sucursal en la base de datos
   **/
  public getMaxMinDeExistenciaBySucursal(sucursal: string): Observable<MaxMinDeExistencia>
  {
    return this.http.get<MaxMinDeExistencia>(`${this.urlEndPoint}S/${sucursal}`);
  }

  /**
   **@return Realiza un update de la configuracion en la base de datos
   **/
  public update(maxMin: MaxMinDeExistencia): Observable<MaxMinDeExistencia>
  {
    return this.http.put<MaxMinDeExistencia>(`${this.urlEndPoint}/${maxMin.id_maxMinDeExistencia}`, maxMin, {headers: this.httpHeaders});

  }
}
