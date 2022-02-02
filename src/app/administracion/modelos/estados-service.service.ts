import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Estado } from '../servicios/estados';

@Injectable({
  providedIn: 'root'
})
export class EstadosServiceService {

  private urlEstado : string = environment.urlAdmin+`/estado`;
  private urlEstado2 : string = environment.urlAdmin+`/empleadosPS`;

  constructor(private http: HttpClient) { }


  getAll(): Observable<Estado[]>{
      return this.http.get<Estado[]>(`${this.urlEstado}`);
  }
  getByIdEstado(idEstado: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.urlEstado}/${idEstado}`);
  }
  getByNombre(nombre: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.urlEstado}/nombre/${nombre}`);
  }
  getByabreve(abrev: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.urlEstado}/abrev/${abrev}`);
  }
  getByclaveCurp(claveCurp: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.urlEstado}/claveCurp/${claveCurp}`);
  }
  getByactivo(activo: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.urlEstado}/activo/${activo}`);
  }
  createEstado(estado: Estado): Observable<Estado>{
    return this.http.post<Estado>(`${this.urlEstado}`, estado);
}

}
