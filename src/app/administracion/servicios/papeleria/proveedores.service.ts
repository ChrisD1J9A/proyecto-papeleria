import { Injectable } from '@angular/core';
import {Proveedor} from '../../modelos/papeleria/proveedor';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private urlEndPoint:string = 'http://localhost:8080/api/proveedores';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getProveedores(): Observable<Proveedor[]>
  {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Proveedor[])
    );
  }

  public create(proveedor: Proveedor): Observable<Proveedor>
  {
      return this.http.post<Proveedor>(this.urlEndPoint, proveedor, {headers: this.httpHeaders})
  }

  public update(proveedor: Proveedor): Observable<Proveedor>
  {
    return this.http.put<Proveedor>(`${this.urlEndPoint}/${proveedor.id_proveedor}`, proveedor, {headers: this.httpHeaders});
  }

  public getProveedor(id): Observable<Proveedor>
  {
    return this.http.get<Proveedor>(`${this.urlEndPoint}/${id}`);
  }
}
