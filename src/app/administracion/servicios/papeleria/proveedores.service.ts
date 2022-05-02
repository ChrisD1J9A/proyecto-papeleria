import { Injectable } from '@angular/core';
import {Proveedor} from '../../modelos/papeleria/proveedor';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private urlEndPoint:string = 'http://localhost:8080/api/proveedores';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getProveedores(): Observable<Proveedor[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Proveedor[])
    );
  }

  public create(proveedor: Proveedor): Observable<Proveedor>
  {
      return this.http.post<Proveedor>(this.urlEndPoint, proveedor, {headers: this.httpHeaders}).pipe(
        catchError (e => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error , 'error');
          return throwError(e);
        }));
  }

  public update(proveedor: Proveedor): Observable<Proveedor>
  {
    return this.http.put<Proveedor>(`${this.urlEndPoint}/${proveedor.id_proveedor}`, proveedor, {headers: this.httpHeaders}).pipe(
      catchError (e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error , 'error');
        return throwError(e);
      }));
  }

  public getProveedor(id): Observable<Proveedor>
  {
    return this.http.get<Proveedor>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/proveedores']);
        console.error(e.error.mensaje);
        swal.fire('Error al consultar', e.error.mensaje, 'error');
        return throwError(e);
      }));
  }
}
