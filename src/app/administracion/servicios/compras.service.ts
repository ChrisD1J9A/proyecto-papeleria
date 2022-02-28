import { Injectable } from '@angular/core';
import { Compra } from '../modelos/compra';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private urlEndPoint: string = 'http://localhost:8080/api/compras';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private httpHeadersArchivo = new HttpHeaders({ 'Content-Type': 'application/octet-stream' });

  constructor(private http: HttpClient) { }

  public create(compra: Compra): Observable<Compra>
  {
      return this.http.post<Compra>(this.urlEndPoint, compra, {headers: this.httpHeaders})
  }

  public  update(compra: Compra): Observable<Compra>
  {
    return this.http.put<Compra>(`${this.urlEndPoint}/${compra.id_compra}`, compra, {headers: this.httpHeaders})
  }

  getCompras(): Observable<Compra[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Compra[])
    );
  }

  getCompra(id): Observable<Compra>
  {
    return this.http.get<Compra>(`${this.urlEndPoint}/${id}`);
  }

  cargarTicket(archivo: File, id): Observable<Compra>
  {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    return this.http.post(`${this.urlEndPoint}/add/file`, formData).pipe(
      map((response: any) => response.compra as Compra)
    );
  }

  /*descargarTicket(nombreArchivo: String): Observable<Blob>
  {
    return this.http.get(`${this.urlEndPoint}/show/archivo/${nombreArchivo}`, { headers: this.httpHeadersArchivo, responseType: 'blob' })
    .map((response: Response) => response.blob())
    .catch(this.handle)
  }*/
}
