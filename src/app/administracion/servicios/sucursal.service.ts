import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Sucursal } from '../modelos/sucursal';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

    // private urlApi : string = 'http://localhost:8080/api/sucursales';
    private urlApi : string = environment.urlAdmin+'/sucursales';
   // private urlApi : string = 'http://200.39.22.86:6061/buro/api/sucursales';

   // private urlApi : string = 'http://192.168.1.13:8080/buro/api/sucursales';


  constructor(private http: HttpClient) { }

  getSucursal(idSucursal :number) {
      return this.http.get<Sucursal>(`${this.urlApi}/${idSucursal}`);
  }

  getSucursales() :Observable<Sucursal[]>{
      return this.http.get<Sucursal[]>(`${this.urlApi}`);
  }
  
  createSucursal(sucursal: any,idRegion: any) {
    return this.http.post<Sucursal>(`${this.urlApi}/${idRegion}/sucursal`, sucursal);
  }

  updateSucursal(idRegion: any, idSucursal: any, sucursal: any) {
    return this.http.put<Sucursal>(`${this.urlApi}/${idRegion}/sucursal/${idSucursal}`, sucursal); // /region/{idRegion}/sucursal/{idSucursal}
  }

  //obtener region por nombre
  getByNombreSucursal(nombreSucursal: any) {
    return this.http.get<Sucursal>(`${this.urlApi}/${nombreSucursal}/nombreSucursal`);
  }
}
