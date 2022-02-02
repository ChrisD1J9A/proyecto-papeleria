import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Usuario } from '../modelos/usuario';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

    //private urlApi : string = 'http://localhost:8080/api/usuarios';

   //private urlApi : string = 'http://.22.86:6060/buro/api/usuarios';
   private urlApi : string = environment.urlAdmin+'/usuarios';
   // private urlApi : string = 'http://200.39.22.86:6061/buro/api/usuarios';
   private urlUsuarios: string = environment.urlAdmin+`/usuarios`;
    private urlPerfil: string = environment.urlAdmin+`/usuario`;
    private urlEmpleado: string = environment.urlAdmin+`/empleado`;
    private urlRoles: string = environment.urlAdmin+`/perfiles`;
    private nuevo: string = environment.urlAdmin+`/jeje`;

    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
     rolLocal:any =localStorage.getItem('roles');
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Usuario[]>(this.urlApi);
    }

    delete(id: number) {
        return this.http.delete(`${this.urlApi}/${id}`, {headers: this.httpHeaders}).subscribe((res) => {

        });
    }
    getByID(id :number){
        return this.http.get<Usuario>(`${this.urlApi}/${id}`);
    }

    getUsuario(username :string){
        return this.http.get<Usuario>(`${this.urlApi}/${username}`);
    }

    roleMatch(allowedRoles :string[]): boolean {
      var isMatch = false;

      let userRoles = JSON.parse(this.rolLocal);
      allowedRoles.forEach(element => {
          for(let rol of userRoles.roles)
          {
              if (element == rol.authority) {
                isMatch = true;
                return false;
              }
          }
          return element;
      });
      return isMatch;
    }



    // getAll(): Observable<Usuario[]>{
    //     return this.http.get<Usuario[]>(`${this.apiUrl}`).pipe(
    //       map(response => response as Usuario[])
    //     );
    // }
    getIdEmpleado(username: string): Observable<number> {
      return this.http.get<number>(`${this.urlUsuarios}/nombreUsuario/${username}`);
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

    getEmpleados(){
      return this.http.get<any>(`${environment.urlAdmin}/empleados`);
    }

    getAllPerfiles(){
      return this.http.get<any[]>(this.urlRoles);
    }

}
