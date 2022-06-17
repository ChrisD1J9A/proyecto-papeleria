import { Injectable } from '@angular/core';
import {Proveedor} from '../../modelos/papeleria/proveedor';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private urlEndPoint:string = environment.apiUrl + 'proveedores';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  /**
   **@return Devuelve un arreglo de proveedores de la base de datos
   **/
  getProveedores(): Observable<Proveedor[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Proveedor[])
    );
  }

  /**
   **@return Crea o almacena un proveedor nuevo la base de datos
   **/
  public create(proveedor: Proveedor): Observable<any>
  {
      return this.http.post<any>(this.urlEndPoint, proveedor, {headers: this.httpHeaders});
  }

  /**
   **@return Hace un update de un proveedor en la base de datos y devuelve el mismo actualizado
   **/
  public update(proveedor: Proveedor): Observable<any>
  {
    return this.http.put<Proveedor>(`${this.urlEndPoint}/${proveedor.id_proveedor}`, proveedor, {headers: this.httpHeaders});
  }

  /**
   **@return Devuelve un proveedor mediante su id en la base de datos
   **/
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
