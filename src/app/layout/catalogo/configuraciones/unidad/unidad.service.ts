import { Injectable } from '@angular/core';
import {UNIDADES} from './unidad.json';
import {Unidad} from './unidad';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadService
{
  private urlEndPoint:string = 'http://localhost:8080/api/unidades';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getUnidades(): Observable<Unidad[]>
  {
    //return of(UNIDADES);
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Unidad[])
    );
  }

  public create(unidad: Unidad): Observable<Unidad>
  {
      return this.http.post<Unidad>(this.urlEndPoint, unidad, {headers: this.httpHeaders})
  }

  public getUnidad(id): Observable<Unidad>
  {
    return this.http.get<Unidad>(`${this.urlEndPoint}/${id}`);
  }

  public update(unidad: Unidad): Observable<Unidad>
  {
    return this.http.put<Unidad>(`${this.urlEndPoint}/${unidad.id_unidad}`, unidad, {headers: this.httpHeaders});

  }
}
