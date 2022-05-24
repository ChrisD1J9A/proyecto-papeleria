import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivateChild {
  constructor(private router: Router)
  {}

  //Metodo para validar si el usuario tienen acceso  a ciertas rutas
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Verifica que el usurio este logeado y si tiene permisos
      if (childRoute.data.permiso && !this.hasPermiso(childRoute.data.permiso)) {
        //Comprueba el usuario logeado
        if (localStorage.getItem('currentUser') != null) {
          //De no tener permiso a una ruta pero esta logeado un usuario se redirige a la pantalla principal
          this.router.navigate(['layout']);
          return false;
        } else {
          //Si no esta logeado el usuario siempre se redirigira al login
          this.router.navigate(['login']);
          return false;
        }
      } else {
        return true;
      }

  }

  //Metodo para verificar si un usuario tiene permiso en una ruta
  hasPermiso(permiso: string): boolean {
  //Se verifica que tenga permisos
  if (localStorage.getItem('permisos') != null) {
    //Obtiene los permisos que se guardaron el login
    let permisos = JSON.parse(localStorage.getItem('permisos'));
    //Verifica el permiso
    let a = permisos.find(perm => perm.nombre == permiso);
    if (a != null) {
      //Retorna true si  tiene permisos
      return true;
    } else {
      //Retorna false si no tiene
      return false;
    }
  }
  //Implica que no tiene permiso alguno
  return false;
}
}
