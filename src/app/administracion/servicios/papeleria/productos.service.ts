import { Injectable } from '@angular/core';
import {Producto} from '../../modelos/papeleria/producto';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private urlEndPoint:string = environment.apiUrl + 'productos';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  /**
   **@return Devuelve un arreglo de productos de la base de datos
   **/
  public getProductos(): Observable<Producto[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Producto[])
    );
  }

  /**
   **@return Crea o almacena un producto en la base de datos
   **/
  public create(producto: Producto): Observable<any>
  {
      return this.http.post<any>(this.urlEndPoint, producto, {headers: this.httpHeaders});
  }

  /**
   **@return Realiza el update un producto en la base de datos y devuelve el mismo ya actualizado
   **/
  public update(producto: Producto): Observable<Producto>
  {
    return this.http.put<Producto>(`${this.urlEndPoint}/${producto.id_producto}`, producto, {headers: this.httpHeaders});
  }

  /**
   **@return Busca un producto en la base de datos mediante su id
   **/
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
