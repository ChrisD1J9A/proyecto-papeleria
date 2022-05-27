import { Injectable } from '@angular/core';
import { Detalle_inventario } from '../../modelos/papeleria/detalle_inventario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleInventarioService {
  private urlEndPoint: string = environment.apiUrl + 'detalle_inventario';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crea detalles de inventario en la base de datos
   **/
  public create(deta_inventario: Detalle_inventario): Observable<Detalle_inventario>
  {
      return this.http.post<Detalle_inventario>(this.urlEndPoint, deta_inventario, {headers: this.httpHeaders})
  }

  /**
   **@return Se actualizan los detalles de inventario en la base de datos
   **/
  public update(detalle_inventario: Detalle_inventario[], id_inventario: number): Observable<Detalle_inventario[]>
  {
    return this.http.put<Detalle_inventario[]>(`${this.urlEndPoint}/${id_inventario}`, detalle_inventario, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen los detalles de inventario en la base de datos mediante el id_inventario
   **/
  public getDetallesInventario(id_i: number): Observable<Detalle_inventario[]>
  {
    return this.http.get<Detalle_inventario[]>(`${this.urlEndPoint}/${id_i}`);
  }

  /**
   **@return Se obtienen todos los detalles de inventario de la base de datos
   **/
  public getTodosInventarios(): Observable<any[]>
  {
    return this.http.get<any[]>(`${this.urlEndPoint}/todos`);
  }
}
