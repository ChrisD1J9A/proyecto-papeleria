import { Injectable } from '@angular/core';
import {Unidad} from '../../modelos/papeleria/unidad';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadService
{
  private urlEndPoint:string = environment.apiUrl + 'unidades';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  /**
   **@return Devuelve un arreglo de todas las unidades almacenadas en la base de datos
   **/
  getUnidades(): Observable<Unidad[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Unidad[])
    );
  }

  /**
   **@return Crea o almacena un Objeto de tipo Unidad en la base de datos
   **/
  public create(unidad: Unidad): Observable<any>
  {
      return this.http.post<any>(this.urlEndPoint, unidad, {headers: this.httpHeaders}).pipe(
        catchError (e => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, 'Error al ingresar' , 'error');
          return throwError(e);
        }));
  }

  /**
   **@return Se consulta en la base de datos una unidad mediante su id
   **/
  public getUnidad(id): Observable<Unidad>
  {
    return this.http.get<Unidad>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        //this.router.navigate(['/productos'])
        console.error(e.error.mensaje);
        swal.fire('Error al consultar', e.error.mensaje, 'error');
        return throwError(e);
      }));;
  }

  /**
   **@return Se actualiza de ser existente, un Objeto de tipo Unidad en la base de datos
   **/
  public update(unidad: Unidad): Observable<any>
  {
    return this.http.put(`${this.urlEndPoint}/${unidad.id_unidad}`, unidad, {headers: this.httpHeaders}).pipe(
      catchError (e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error , 'error');
        return throwError(e);
      }));
  }
}
