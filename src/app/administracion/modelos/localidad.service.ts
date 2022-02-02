import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Localidad } from '../servicios/localidad';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  private urlLocalidad : string = environment.urlAdmin+`/localidades`;
  constructor(private http: HttpClient) { }
  
  getLocalidad(idLocalidad: any): Observable<Localidad[]>{
    return this.http.get<Localidad[]>(`${this.urlLocalidad}/${idLocalidad}`);
  }
  findByestado(estadoId: any): Observable<Localidad>{
    return this.http.get<Localidad>(`${this.urlLocalidad}/estadoId/${estadoId}`);
  }
  findByMunicipio(municipioId: any): Observable<Localidad>{
    return this.http.get<Localidad>(`${this.urlLocalidad}/municipioId/${municipioId}`);
  }

  findByMunicipioAndEstadoId(municipioId: any,estadoId: any): Observable<Localidad>{
    return this.http.get<Localidad>(`${this.urlLocalidad}/municipioId/${municipioId}/estadoId/${estadoId}`);
  }
}