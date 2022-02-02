import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Usuario } from '../modelos';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }
    
    //private urlApi : string = 'http://localhost:8080/api/login';
    //private url : string = 'http://localhost:8080/api/usuarios';
     
 
     private urlApi : string = environment.urlAdmin+'/login';
    private url : string =environment.urlAdmin+'/usuarios';
 
 
     //private urlApi : string = 'http://192.168.1.13:8080/buro/api/login';
     //private url : string = 'http://192.168.1.13:8080/buro/api/usuarios';
 
 
     private httpHeaders = new HttpHeaders(
         {
             'Content-Type': 'application/json'
         }
     );
 
     login(usuario :Usuario, sucursal: string) {
          //
         return this.http.post(this.urlApi+"?username="+usuario.username+"&password="+usuario.password+"&sucursal="+sucursal
         , {headers: this.httpHeaders})
            .pipe(map((res:any) => {
                 // login exitoso si se recibe un jwt token
                if (res && res.token) {
                   
                         // se almacena localmente el usario y el jwt token
                     localStorage.setItem('currentUser', JSON.stringify({ username: usuario.username, token: res.token }));
                     localStorage.setItem('roles', JSON.stringify({roles: res.user.detalles.permsos }));
                     
                         return res;

                     
                  
                 }
                 console.log(res);
                 return res;
             }));
     }
 
     logout() {
         // se elimina localmente el usuario
         localStorage.removeItem('currentUser');
         localStorage.removeItem('roles');
         localStorage.removeItem('sucursales');
         localStorage.removeItem('region');
     }
 }
 