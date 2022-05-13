import { Injectable } from '@angular/core';
import {Producto} from '../../modelos/papeleria/producto';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private urlEndPoint:string = 'http://localhost:8080/api/productos';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  getProductos(): Observable<Producto[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Producto[])
    );
  }

  public create(producto: Producto): Observable<any>
  {
      return this.http.post<any>(this.urlEndPoint, producto, {headers: this.httpHeaders}).pipe(
        catchError (e => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error , 'error');
          return throwError(e);
        }));
  }

  public update(producto: Producto): Observable<Producto>
  {
    return this.http.put<Producto>(`${this.urlEndPoint}/${producto.id_producto}`, producto, {headers: this.httpHeaders}).pipe(
      catchError (e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error , 'error');
        return throwError(e);
      }));
  }

  public getProducto(id): Observable<Producto>
  {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/productos'])
        console.error(e.error.mensaje);
        swal.fire('Error al consultar', e.error.mensaje, 'error');
        return throwError(e);
      }));
  }
}
