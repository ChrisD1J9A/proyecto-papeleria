import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Sucursal } from '../servicios/sucursal';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private urlSucursales : string = environment.urlAdmin+`/sucursales`;
  private urlSucursalesByRegion : string = environment.urlAdmin+`/region`;

  constructor(private http: HttpClient) { }

  //obtener todas las regiones
  getAllSucursales(): Observable<Sucursal[]>{
      return this.http.get<Sucursal[]>(`${this.urlSucursales}`);
  }

  getSucursaleBy(id: any): Observable<Sucursal>{
      return this.http.get<Sucursal>(`${this.urlSucursales}/${id}`);
  }

  getSucursalesByRegion(id: any): Observable<Sucursal>{
      return this.http.get<Sucursal>(`${this.urlSucursalesByRegion}/${id}/sucursales`);
  }

  deleteSucursal(id: any) {
    return this.http.delete(`${this.urlSucursales}/${id}`);
  }

  createSucursal(sucursal: any,idRegion: any) {
    return this.http.post<Sucursal>(`${this.urlSucursalesByRegion}/${idRegion}/sucursal`, sucursal);
  }

  updateSucursal(idRegion: any, idSucursal: any, sucursal: any) {
    return this.http.put<Sucursal>(`${this.urlSucursalesByRegion}/${idRegion}/sucursal/${idSucursal}`, sucursal); // /region/{idRegion}/sucursal/{idSucursal}
  }

  //obtener region por nombre
  getByNombreSucursal(nombreSucursal: any) {
    return this.http.get<Sucursal>(`${this.urlSucursales}/${nombreSucursal}/nombreSucursal`);
  }
}
