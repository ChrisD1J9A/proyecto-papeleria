import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Puestos } from '../servicios/puestos';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {
  private urlPerfiles : string = environment.urlAdmin+`/puesto`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Puestos[]>{
      return this.http.get<Puestos[]>(`${this.urlPerfiles}`);
  }
  getByid(id:number): Observable<Puestos[]>{
    return this.http.get<Puestos[]>(`${this.urlPerfiles}/${id}`);
}
  createArea(puesto:Puestos) {
    return this.http.post<Puestos>(this.urlPerfiles, puesto);
  }
///puesto/{idPuesto}/area/{idArea}/subarea/{idSubArea}
  updateArea(id:number,idArea:number,idSubArea:number, area:Puestos) {
    return this.http.put<Puestos>(`${this.urlPerfiles}/${id}/area/${idArea}/subarea/${idSubArea}`, area);
  }
}
