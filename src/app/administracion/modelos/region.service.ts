import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Region } from '../servicios/region';


@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private urlRegiones : string = environment.urlAdmin+`/regiones`;

  constructor(private http: HttpClient) { }

  getAllRegiones(): Observable<Region[]>{
      return this.http.get<Region[]>(`${this.urlRegiones}`);
  }

  deleteRegion(id: any) {
    return this.http.delete(`${this.urlRegiones}/${id}`);
  }

  createRegion(region: any) {
    return this.http.post<Region>(this.urlRegiones, region);
  }

  updateRegion(id: any, region: any) {
    return this.http.put<Region>(`${this.urlRegiones}/${id}`, region);
  }

  getByNombreRegion(nombreRegion: any) {
    return this.http.get<Region>(`${this.urlRegiones}/${nombreRegion}/nombreRegion`);
  }

  getByIdRegion(idRegion: any) {
    return this.http.get<Region>(`${this.urlRegiones}/${idRegion}`);
  }
}
