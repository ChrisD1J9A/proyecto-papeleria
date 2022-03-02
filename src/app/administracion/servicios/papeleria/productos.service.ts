import { Injectable } from '@angular/core';
import {Producto} from '../../modelos/papeleria/producto';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private urlEndPoint:string = 'http://localhost:8080/api/productos';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Producto[])
    );
  }

  public create(producto: Producto): Observable<Producto>
  {
      return this.http.post<Producto>(this.urlEndPoint, producto, {headers: this.httpHeaders})
  }

  public update(producto: Producto): Observable<Producto>
  {
    return this.http.put<Producto>(`${this.urlEndPoint}/${producto.id_producto}`, producto, {headers: this.httpHeaders});
  }

  public getProducto(id): Observable<Producto>
  {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`);
  }
}
