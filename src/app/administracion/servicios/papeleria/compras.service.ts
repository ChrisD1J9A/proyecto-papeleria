import { Injectable } from '@angular/core';
import { Compra } from '../../modelos/papeleria/compra';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private urlEndPoint: string = 'http://localhost:8080/api/compras';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private httpHeadersArchivo = new HttpHeaders({ 'Content-Type': 'application/octet-stream' });

  constructor(private http: HttpClient) { }

  /**
   **@return Se crea/almacenan nuevas compras en la base de datos
   **/
  public create(compra: Compra): Observable<Compra>
  {
      return this.http.post<Compra>(this.urlEndPoint, compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se actualizan las compras de la base de datos
   **/
  public  update(compra: Compra): Observable<Compra>
  {
    return this.http.put<Compra>(`${this.urlEndPoint}/${compra.id_compra}`, compra, {headers: this.httpHeaders})
  }

  /**
   **@return Se obtienen las compras de la base de datos
   **/
  getCompras(): Observable<Compra[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Compra[])
    );
  }

  /**
   **@return Se obtiene una Compra mediante su id
   **/
  getCompra(id): Observable<Compra>
  {
    return this.http.get<Compra>(`${this.urlEndPoint}/${id}`);
  }

  /**
   **@return Se obtienen las compras de una determinada sucursal
   **/
  getCompraBySucursal(id): Observable<Compra[]>
  {
    return this.http.get<Compra[]>(`${this.urlEndPoint}/sucursal/${id}`);
  }

  /**
   **@return Se carga el ticket de compra en la base de datos
   **/
  cargarTicket(archivo: File, id): Observable<Compra>
  {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    return this.http.post(`${this.urlEndPoint}/add/file`, formData).pipe(
      map((response: any) => response.compra as Compra)
    );
  }

  /**
   **@return Se obtienen los gastos maximos hechos en las sucursales y filtradas por rango de fechas fijos(Ejm, los ultimos 6 meses) de la base de datos
   **/
  gastoMaxPorSucursales(meses: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/maxGasto/${meses}`);
  }

  /**
   **@return Se obtienen los gastos maximos hechos en las sucursales desde siempre en la base de datos
   **/
  gastoMaxPorSucursalesHistorico(): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/maxGasto`);
  }

  /**
   **@return Se obtienen los gastos maximos hechos en las sucursales y filtradas por rango de fechas de la base de datos
   **/
  gastoMaxPorSucursalesRangos(fecha1: string, fecha2: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/maxGasto/${fecha1}/${fecha2}`);
  }

  /**
   **@return Se obtienen los gastos totales hechas en las sucursales y filtradas por rango de fechas de la base de datos en un rango de tiempo
   **/
  gastoTotalPorSucursales(meses: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/gastoTotal/${meses}`);
  }

  /**
   **@return Se obtienen los gastos totales hechas en las sucursales desde siempre en la base de datos
   **/
  gastoTotalPorSucursalesHistorico(): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/gastoTotal`);
  }

  /**
   **@return Se obtienen los gastos totales hechas en las sucursales y filtradas por rango de fechas de la base de datos
   **/
  gastoTotalPorSucursalesRangos(fecha1: string, fecha2: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.urlEndPoint}/reportes/gastoTotal/${fecha1}/${fecha2}`);
  }

  /**
   **@return Se obtienen Compras de la base de datos mediante un periodo de tiempo especifico(Por ejemplo, los ultimos 6 meses)
   **/
  getComprasPorTiempo(meses: number): Observable<Compra[]>{
    return this.http.get<Compra[]>(`${this.urlEndPoint}/tiempo/${meses}`);
  }

  /**
   **@return Se obtienen Compras de la base de datos en un rango de tiempo
   **/
  getComprasPorRangos(fecha1: string, fecha2: string): Observable<Compra[]>{
    return this.http.get<Compra[]>(`${this.urlEndPoint}/tiempo/${fecha1}/${fecha2}`);
  }
}
