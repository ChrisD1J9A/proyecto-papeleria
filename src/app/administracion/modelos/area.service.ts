import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Area } from '../servicios/area';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
 
  private urlAreas : string = environment.urlAdmin+`/area`;

  constructor(private http: HttpClient) { }

  getAllAreas(): Observable<Area[]>{
      return this.http.get<Area[]>(`${this.urlAreas}`);
  }

  getByIdArea(id:number): Observable<Area>{
      return this.http.get<Area>(`${this.urlAreas}/${id}`);
  }
  getByIdAreaSyperior(id:number): Observable<Area[]>{
    return this.http.get<Area[]>(`${this.urlAreas}/subArea/${id}`);
}

  deleteArea(id:number) {
    return this.http.delete(`${this.urlAreas}/${id}`);
  }

  createArea(area:Area) {
    return this.http.post<Area>(this.urlAreas, area);
  }

  updateArea(id:number, area:Area) {
    return this.http.put<Area>(`${this.urlAreas}/${id}`, area);
  }

  getByNombreArea(nomArea:any) {
    return this.http.get<Area>(`${this.urlAreas}/${nomArea}/nombreArea`);
  }

}