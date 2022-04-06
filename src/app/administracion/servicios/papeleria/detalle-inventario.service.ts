import { Injectable } from '@angular/core';
import { Detalle_inventario } from '../../modelos/papeleria/detalle_inventario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleInventarioService {
  private urlEndPoint: string = 'http://localhost:8080/api/detalle_inventario';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(deta_inventario: Detalle_inventario): Observable<Detalle_inventario>
  {
      return this.http.post<Detalle_inventario>(this.urlEndPoint, deta_inventario, {headers: this.httpHeaders})
  }

  public update(detalle_inventario: Detalle_inventario[], id_inventario: number): Observable<Detalle_inventario[]>
  {
    return this.http.put<Detalle_inventario[]>(`${this.urlEndPoint}/${id_inventario}`, detalle_inventario, {headers: this.httpHeaders})
  }

  public getDetallesInventario(id_i: number): Observable<Detalle_inventario[]>
  {
    return this.http.get<Detalle_inventario[]>(`${this.urlEndPoint}/${id_i}`);
  }

  public getTodosInventarios(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.urlEndPoint}/todos`);
  }
}
