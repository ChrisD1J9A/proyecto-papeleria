import { Injectable } from '@angular/core';
import { Inventario } from '../../modelos/papeleria/inventario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private urlEndPoint: string = environment.apiUrl + 'inventario';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crea/almacena un nuevo Inventario en la base de datos
   **/
  public create(inventario: Inventario): Observable<Inventario>
  {
      return this.http.post<Inventario>(this.urlEndPoint, inventario, {headers: this.httpHeaders})
  }

  /**
   **@return Se actualiza un Inventario de la base de datos
   **/
  public  update(inventario: Inventario): Observable<Inventario>
  {
    return this.http.put<Inventario>(`${this.urlEndPoint}/${inventario.id_inventario}`, inventario, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen todos los Inventarios de la base de datos
   **/
  public getInventarios(): Observable<Inventario[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Inventario[])
    );
  }

  /**
   **@return Se obtiene un Inventario de la base de datos mediante su id
   **/
  public getInventario(id): Observable<any>
  {
    return this.http.get(`${this.urlEndPoint}/${id}`);
  }

  /**
   **@return Se busca un Inventario la base de datos mediante la sucursal
   **/
  public getInventarioBySucursal(id): Observable<Inventario>
  {
    return this.http.get<Inventario>(`${this.urlEndPoint}/Sucursal/${id}`);
  }
}
