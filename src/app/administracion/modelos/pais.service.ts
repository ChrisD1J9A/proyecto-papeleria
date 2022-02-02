import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Pais } from '../servicios/pais';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private urlPais : string = environment.urlAdmin+`/pais`;
  constructor(private http: HttpClient) { }
  
 

  getAll(): Observable<Pais[]>{
    return this.http.get<Pais[]>(`${this.urlPais}`);
  }

  addPais(pais:any): Observable<Pais>{
    return this.http.post<Pais>(`${this.urlPais}`, pais);
  }

  getPais(idPais:any): Observable<Pais>{
    return this.http.get<Pais>(`${this.urlPais}/${idPais}`);
  }

  findNombre(nombrePais:any): Observable<Pais>{
    return this.http.get<Pais>(`${this.urlPais}/nombrePais/${nombrePais}`);
  }
}