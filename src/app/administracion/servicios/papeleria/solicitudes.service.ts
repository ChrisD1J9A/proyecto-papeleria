import { Injectable } from '@angular/core';
import { Solicitud } from '../../modelos/papeleria/solicitud';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private urlEndPoint: string = environment.apiUrl + 'solicitudes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  /**
   **@return Metodo el cual crea o se almacena una Solicitud en la base de datos y devuevle el objeto si fue almacenado correctamente
   **/
  public create(solicitud: Solicitud): Observable<Solicitud>
  {
      return this.http.post<Solicitud>(this.urlEndPoint, solicitud, {headers: this.httpHeaders})
  }

  /**
   **@return Metodo utilizado para hacer un Update a la tabla solicitud, recibe como parametro el elemento a actualizar y devuelve el elemento actualizado
   **/
  public  update(solicitud: Solicitud): Observable<Solicitud>
  {
    return this.http.put<Solicitud>(`${this.urlEndPoint}/${solicitud.id_solicitud}`, solicitud, {headers: this.httpHeaders})
  }

  /**
   **@return Devuelve un arreglo de solicitudes almacenadas en la base de datos
   **/
  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Solicitud[])
    );
  }

  /**
   **@return Devuelve un arreglo de solicitudes de una determinada sucursal en la base de datos
   **/
  getSolicitudesBySucursal(id): Observable<Solicitud[]>
  {
    return this.http.get<Solicitud[]>(`${this.urlEndPoint}/sucursal/${id}`);
  }

  /**
   **@return Devuelve un arreglo de solicitudes de un determinado estatus
   **/
  getSolicitudesByEstatus(estatus: string): Observable<Solicitud[]>
  {
    return this.http.get<Solicitud[]>(`${this.urlEndPoint}/estatus/${estatus}`);
  }

  /**
   **@return Devuelve un arreglo de solicitudes de una determinada sucursal y de determinado estatus
   **/
  getSolicitudesBySucursalAndEstatus(id: number, estatus: string): Observable<Solicitud[]>
  {
    return this.http.get<Solicitud[]>(`${this.urlEndPoint}/sucursal/${id}/${estatus}`);
  }
  
  /**
   **@return Devuelve una solicitud mediante su id en la base de datos
   **/
  getSolicitud(id): Observable<any>
  {
    return this.http.get(`${this.urlEndPoint}/${id}`);
  }
}
