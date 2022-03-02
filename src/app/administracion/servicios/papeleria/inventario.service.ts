import { Injectable } from '@angular/core';
import { Inventario } from '../../modelos/papeleria/inventario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private urlEndPoint: string = 'http://localhost:8080/api/inventario';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public create(inventario: Inventario): Observable<Inventario>
  {
      return this.http.post<Inventario>(this.urlEndPoint, inventario, {headers: this.httpHeaders})
  }

  public  update(inventario: Inventario): Observable<Inventario>
  {
    return this.http.put<Inventario>(`${this.urlEndPoint}/${inventario.id_inventario}`, inventario, {headers: this.httpHeaders})
  }

  getInventarios(): Observable<Inventario[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Inventario[])
    );
  }

  getInventario(id): Observable<Inventario>
  {
    return this.http.get<Inventario>(`${this.urlEndPoint}/${id}`);
  }
}
