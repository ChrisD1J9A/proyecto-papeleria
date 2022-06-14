import { Injectable } from '@angular/core';
import {MaxMinDeStock} from '../../modelos/papeleria/maxMinDeStock';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaxMinStockService {
  private urlEndPoint:string = environment.apiUrl + 'maxMinStock';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  /**
   **@return Devuelve todas las configuraciones de la base de datos
   **/
  getMaxMinDeStockA(): Observable<MaxMinDeStock[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as MaxMinDeStock[])
    );
  }

  /**
   **@return Crea o almacena una nueva configuracion en la base de datos
   **/
  public create(maxMin: MaxMinDeStock): Observable<MaxMinDeStock>
  {
      return this.http.post<MaxMinDeStock>(this.urlEndPoint, maxMin, {headers: this.httpHeaders})
  }

  /**
   **@return Se consulta la configuracion en la base de datos mediante su id
   **/
  public getMaxMinDeStock(id): Observable<any>
  {
    return this.http.get(`${this.urlEndPoint}/${id}`);
  }

  /**
   **@return Se busca la configuracion de X sucursal en la base de datos
   **/
  public getMaxMinDeStockBySucursal(sucursal: string): Observable<MaxMinDeStock>
  {
    return this.http.get<MaxMinDeStock>(`${this.urlEndPoint}S/${sucursal}`);
  }

  /**
   **@return Realiza un update de la configuracion en la base de datos
   **/
  public update(maxMin: MaxMinDeStock): Observable<MaxMinDeStock>
  {
    return this.http.put<MaxMinDeStock>(`${this.urlEndPoint}/${maxMin.id_maxMinDeStock}`, maxMin, {headers: this.httpHeaders});

  }
}
