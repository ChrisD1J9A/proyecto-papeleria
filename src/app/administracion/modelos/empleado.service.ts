import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Empleado } from '../servicios/empleado';
import { Puestos } from '../servicios/puestos';
import { Sucursal } from '../servicios/sucursal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
 
  private urlEmpleados : string = environment.urlAdmin+`/empleados`;
  private urlEmpleados2 : string = environment.urlAdmin+`/empleadosPS`;

  constructor(private http: HttpClient) { }


  getAll(): Observable<Empleado[]>{
      return this.http.get<Empleado[]>(`${this.urlEmpleados}`);
  }

  getEmpleadosEstatusBaja(): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.urlEmpleados}/byEstatus/BAJA`);
}

  findByPuestoAndSucursal(puesto: any,sucursal:any ):Observable<Empleado>{
    return this.http.get<Empleado>(`${this.urlEmpleados}/${puesto}`);  
    //return null;
    //return this.http.post<Empleado>(`${this.urlEmpleados}/direccion/${idDireccion}/puesto/${idPuesto}/sucursal/${idSucursal}`, empleado);

  }

  getAllWithoutUser(): Observable<Empleado>{
      return this.http.get<Empleado>(`${this.urlEmpleados}/sinUser`);
  }
  

  getEmpleado(id: any): Observable<Empleado>{
      return this.http.get<Empleado>(`${this.urlEmpleados}/${id}`);
  }

  getByPuesto(idPuesto: any): Observable<Empleado>{
      return this.http.get<Empleado>(`${this.urlEmpleados}/puesto/${idPuesto}`);
  }

  getBySucursal(idSucursal: any): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(`${this.urlEmpleados}/sucursal/${idSucursal}`);
  }

  getEmpleadorList(term: any):Observable<Empleado> {
        // let headers = new HttpHeaders();
        // headers.set('Content-Type', 'application/json');

        return this.http.get<Empleado>(`${this.urlEmpleados}/cargar-empleados/${term}`);
    }

    findRFC(rfc: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados}/rfc/${rfc}`);
    }

    findCurp(curp: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados}/curp/${curp}`);
    }

    findIne(ine: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados}/ine/${ine}`);
    }

    findRegion(idEmpleado: any): Observable<any>{
        return this.http.get<any>(`${this.urlEmpleados}/${idEmpleado}/regiones`);
    }

    findEstatus(estatus: any): Observable<any>{
        return this.http.get<any>(`${this.urlEmpleados}/estatus/${estatus}`);
    }

    existsRegion(idRegion: any): Observable<boolean>{
      return this.http.get<boolean>(`${this.urlEmpleados}/region/${idRegion}`);
    }

    findGerenteSucursal(idSucursal: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados}/gerente/sucursal/${idSucursal}`);
    }

    addEmpleado(idPuesto: any,idSucursal: any,empleado: any): Observable<Empleado>{
        return this.http.post<Empleado>(`${this.urlEmpleados}/puesto/${idPuesto}/sucursal/${idSucursal}`, empleado);
    }

    addJerarquiaRegional(idEmpleado: any, idRegion: any): Observable<any>{
        return this.http.post<Empleado>(`${this.urlEmpleados}/${idEmpleado}/region/${idRegion}`, {});
     }
 
     updateEmpleado(empleado: any, idPuesto: any, idSucursal: any): Observable<Empleado>{
         return this.http.put<Empleado>(`${this.urlEmpleados}/${empleado.idEmpleado}/puesto/${idPuesto}/sucursal/${idSucursal}`, empleado);
     }
 
     deleteEmpleado(idEmpleado: any){
       return this.http.delete(`${this.urlEmpleados}/${idEmpleado}`);
     }
     
     reingresoEmpleado(empleado: any,idEmpleado: any): Observable<Empleado>{
      return this.http.put<Empleado>(`${this.urlEmpleados}/reingreso/${idEmpleado}`,empleado);
    }
    
     cambioFechaIngreso(idEmpleado: any, empleado: any ): Observable<Empleado>{
      return this.http.put<Empleado>(`${this.urlEmpleados}/fechaIngreso/${idEmpleado}`,empleado);
     }
     cambiarDatosPuesto(idEmpleado: any, empleado: any, idPuesto: any, idSucursal: any): Observable<Empleado>{
      return this.http.put<Empleado>(`${this.urlEmpleados}/datosPuesto/${idEmpleado}/puesto/${idPuesto}/sucursal/${idSucursal}`,empleado);
     }
 
     getEmpleadosAltas(): Observable<Empleado[]>{
         return this.http.get<Empleado[]>(`${this.urlEmpleados}/conAltas`);
     }
  
   findNumeroSeguro(numeroSeguro: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados}/numeroSeguro/${numeroSeguro}`);
    }


    getByPuestoSucural(idPuesto: any,idSucursal: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados2}/${idPuesto}/${idSucursal}`);
      }
    
      
      getByTipoPuestoSucural(tipo_empleado: any,idPuesto: any,idSucursal: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados2}/${tipo_empleado}/${idPuesto}/${idSucursal}`);
      }
    
      getByTipoGeneroPuestoSucural(tipo_empleado: any,genero: any,idPuesto: any,idSucursal: any): Observable<Empleado>{
        return this.http.get<Empleado>(`${this.urlEmpleados2}/${tipo_empleado}/${genero}/${idPuesto}/${idSucursal}`);
      }
    
 
 

}
