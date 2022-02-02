import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Puestos } from '../servicios/puestos';
import { SubArea } from '../servicios/subarea';

@Injectable({
  providedIn: 'root'
})
export class SubareaService {
  private urlArea : string = environment.urlAdmin+`/area`;
  private urlSubArea : string = environment.urlAdmin+`/subArea`;

  constructor(private http: HttpClient) { }

  //obtener todas las regiones
  getAllSubAreas(): Observable<SubArea[]>{
      return this.http.get<SubArea[]>(`${this.urlSubArea}`);
  }

  getSubAreasByArea(id: any): Observable<SubArea>{
      return this.http.get<SubArea>(`${this.urlArea}/${id}/subArea`);
  }

  deleteSubArea(id: any) {
    return this.http.delete(`${this.urlSubArea}/${id}`);
  }

  createSubArea(subArea: any,idArea: any) {
    return this.http.post<SubArea>(`${this.urlArea}/${idArea}/subArea`, subArea);
  }

  updateSubArea(idArea: any, idsubArea: any, subArea: any) {
    return this.http.put<SubArea>(`${this.urlArea}/${idArea}/subArea/${idsubArea}`, subArea); // /region/{idRegion}/sucursal/{idSucursal}
  }

  //obtener region por nombre
  getByNombreSubArea(nombreSubarea: any) {
    return this.http.get<SubArea>(`${this.urlSubArea}/${nombreSubarea}/nombreArea`);
  }

  existEmpleadoinSubArea(idSubArea: any): Observable<Puestos> {
    return this.http.get<Puestos>(`${this.urlSubArea}/activos/${idSubArea}`);
  }
}
