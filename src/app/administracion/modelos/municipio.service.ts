import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Municipios } from '../servicios/municipios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private urlMunicipio : string = environment.urlAdmin+`/municipio`;
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Municipios[]>{
    return this.http.get<Municipios[]>(`${this.urlMunicipio}`);
  }
  findByID(id: any): Observable<Municipios>{
    return this.http.get<Municipios>(`${this.urlMunicipio}/${id}`);
}
findByClave(clave: any): Observable<Municipios>{
  return this.http.get<Municipios>(`${this.urlMunicipio}/clave/${clave}`);
}
findBynombre(nombre: any): Observable<Municipios>{
  return this.http.get<Municipios>(`${this.urlMunicipio}/nombre/${nombre}`);
}
  findByestado(estadoId: any): Observable<Municipios>{
    return this.http.get<Municipios>(`${this.urlMunicipio}/estado/${estadoId}`);
}
getactivo(activo: any): Observable<Municipios>{
  return this.http.get<Municipios>(`${this.urlMunicipio}/activo/${activo}`);
}
createRegion(municipio: any) {
  return this.http.post<Municipios>(this.urlMunicipio, municipio);
}

}