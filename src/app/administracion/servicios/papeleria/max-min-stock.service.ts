import { Injectable } from '@angular/core';
import {MaxMinDeStock} from '../../modelos/papeleria/maxMinDeStock';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaxMinStockService {
  private urlEndPoint:string = 'http://localhost:8080/api/maxMinStock';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getMaxMinDeStockA(): Observable<MaxMinDeStock[]>
  {
    //return of(UNIDADES);
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as MaxMinDeStock[])
    );
  }

  public create(maxMin: MaxMinDeStock): Observable<MaxMinDeStock>
  {
      return this.http.post<MaxMinDeStock>(this.urlEndPoint, maxMin, {headers: this.httpHeaders})
  }

  public getMaxMinDeStock(id): Observable<MaxMinDeStock>
  {
    return this.http.get<MaxMinDeStock>(`${this.urlEndPoint}/${id}`);
  }

  public getMaxMinDeStockBySucursal(sucursal: string): Observable<MaxMinDeStock>
  {
    return this.http.get<MaxMinDeStock>(`${this.urlEndPoint}S/${sucursal}`);
  }

  public update(maxMin: MaxMinDeStock): Observable<MaxMinDeStock>
  {
    return this.http.put<MaxMinDeStock>(`${this.urlEndPoint}/${maxMin.id_maxMinDeStock}`, maxMin, {headers: this.httpHeaders});

  }
}
