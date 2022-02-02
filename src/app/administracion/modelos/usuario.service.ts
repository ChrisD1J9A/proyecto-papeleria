import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Usuario } from '../servicios/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlUsuarios: string = environment.urlAdmin+`/usuarios`;
  private urlPerfil: string = environment.urlAdmin+`/usuario`;
  private urlEmpleado: string = environment.urlAdmin+`/empleado`;
  private urlRoles: string = environment.urlAdmin+`/perfiles`;
  private nuevo: string = environment.urlAdmin+`/jeje`;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http: HttpClient) { }

  // getAll(): Observable<Usuario[]>{
  //     return this.http.get<Usuario[]>(`${this.apiUrl}`).pipe(
  //       map(response => response as Usuario[])
  //     );
  // }
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlUsuarios);
  }

  getIdEmpleado(username: string): Observable<number> {
    return this.http.get<number>(`${this.urlUsuarios}/nombreUsuario/${username}`);
  }
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlUsuarios}/${id}`);
  }

  getUsername(username: String): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlUsuarios}/${username}/username`);
  }

  getRegionByUsername(idUser: any): Observable<any> {
    return this.http.get<any>(`${this.urlUsuarios}/${idUser}/regional`);
  }

  getSucursalByUsername(idUser: any): Observable<any> {
    return this.http.get<any>(`${this.urlUsuarios}/${idUser}/SucursalGerencia`);
  }

  getUsuarioByIdEmpleado(idEmpleado: any): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlUsuarios}/empleado/${idEmpleado}`);
  }

  getPeerfilPorUsuario(username: String): Observable<any>{
    return this.http.get<Usuario>(`${this.nuevo}/${username}/username`);
  }

  /*
   getUsername(username: String): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlUsuarios}/${username}/username`);
  }
  */

  getUsuarioByPerfil(idPerfil: any): Observable<Usuario>{
      return this.http.get<Usuario>(`${this.urlUsuarios}/perfil/${idPerfil}`);
  }

  newUsuario(idEmpleado: any, user: any): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.urlEmpleado}/${idEmpleado}`, user);


  }

  createUsuario(idEmpleado: any, user: any): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.urlEmpleado}/${idEmpleado}/usuario`, user);
  }

  deleteUsuario(idUsuario: any): Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.urlUsuarios}/${idUsuario}`);
  }

  updatePassword(idUsuario: any, user: any){
    return this.http.put(`${this.urlUsuarios}/${idUsuario}`, user);
  }

  updateUSuario(idUsuario: any, user: any){
    return this.http.put(`${this.urlUsuarios}/${idUsuario}/new`, user);
  }

  deletePerfil(idUsuario: any, idPerfil: any){
    return this.http.delete<Usuario>(`${this.urlUsuarios}/${idUsuario}/perfil/${idPerfil}`);
  }

  // addPerfilToUser(idUsuario, idPerfil): Observable<Usuario>{
  //   return this.http.post<Usuario>(`${this.urlPerfil}/${idUsuario}/perfil/${idPerfil}`);
  // }

  addPerfil(idUsuario: any, idPerfil: any): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.urlPerfil}/${idUsuario}/perfil/${idPerfil}`,{});
  }

  // getUsuario(id): Observable<Usuario>{
  //   return this.http.get<Usuario>(`${this.urlUsuarios}/${id}`);
  // }

  // getUsuario(id: number) {
  //   return this.http.get(`${this.urlUsuarios}/${id}`)
  //   .pipe( map ( res => {}));
  // }

  getAllRoles() {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.get(this.urlRoles, { headers: reqHeader });
  }

  roleMatch(allowedRoles: any): boolean {
    var isMatch = false;
    //let roles = allowedRoles;
    //var userRoles: string[] = JSON.parse(localStorage.getItem('userRoles'));
    var userRoles: String[] = [];
    //var roles: string[] = JSON.parse(localStorage.getItem('currentUser')).user.authorities
    //console.log(roles)
    JSON.parse(localStorage.getItem('currentUser')|| '{}').user.authorities.forEach((rol:any) => {
      userRoles.push(rol.authority)
      //console.log(rol.authority)
      }
    )
    //console.log(userRoles);
    /*allowedRoles.forEach((element: any) => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
        //console.log(isMatch);
      }
    });*/
    return isMatch;
  }

}
