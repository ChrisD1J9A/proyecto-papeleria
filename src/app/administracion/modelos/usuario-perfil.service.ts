import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UsuarioPerfil } from '../servicios/usuarioperfil';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPerfilService {
  private urlPerfiles : string = environment.urlAdmin+`/usuarioPerfilSucursal`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<UsuarioPerfil[]>{
      return this.http.get<UsuarioPerfil[]>(`${this.urlPerfiles}`);
  }
  getByUser(idUsuario:number): Observable<UsuarioPerfil>{
    return this.http.get<UsuarioPerfil>(`${this.urlPerfiles}/${idUsuario}/usuario`);
  }
  create(idUsuario:number,idPerfil:any,idSucursal:number,idSucursalIngresa:number): Observable<UsuarioPerfil>{
    return this.http.post<UsuarioPerfil>(`${this.urlPerfiles}/insertar/${idUsuario}/${idPerfil}/${idSucursal}/${idSucursalIngresa}`,idUsuario);
  }
  delete(idUsuario:number,idPerfil:number,idSucursal:number,idSucursalIngresa:number): Observable<UsuarioPerfil>{
    return this.http.delete<UsuarioPerfil>(`${this.urlPerfiles}/borrar/${idUsuario}/${idPerfil}/${idSucursal}/${idSucursalIngresa}`);
  }
}
