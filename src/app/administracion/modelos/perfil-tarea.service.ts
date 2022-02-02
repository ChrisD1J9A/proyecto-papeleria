import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { PerfilTarea } from '../servicios/periltarea';

@Injectable({
  providedIn: 'root'
})
export class PerfilTareaService {
  private urlPerfiles : string = environment.urlAdmin+`/perfiltTarea`;
  private urlPerfilT : string = environment.urlAdmin+`/perfilTarea`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<PerfilTarea[]>{
      return this.http.get<PerfilTarea[]>(`${this.urlPerfilT}`);
  }
  findById(idTarea:number): Observable<PerfilTarea[]>{
    return this.http.get<PerfilTarea[]>(`${this.urlPerfiles}/${idTarea}/perfil`);
  }
  findByIdTarea(idSistema:number):any{
    return this.http.get<PerfilTarea[]>(`${this.urlPerfiles}/${idSistema}/tarea`);
  }
  addPefilTarea(idPerfil:number,idTarea:number): Observable<PerfilTarea>{
    return this.http.post<PerfilTarea>(`${this.urlPerfiles}/insertar/${idPerfil}/${idTarea}`, idPerfil);
   
   
}
deltePerfilTarea(idPerfil:number,idTarea:number): any{
   return this.http.delete<PerfilTarea>(`${this.urlPerfiles}/borrar/${idPerfil}/${idTarea}`);
}
}
