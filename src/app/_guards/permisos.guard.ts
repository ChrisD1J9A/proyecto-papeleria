import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivateChild {
  constructor(private router: Router)
  {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (childRoute.data.permiso && !this.hasPermiso(childRoute.data.permiso)) {
        if (localStorage.getItem('currentUser') != null) {
          this.router.navigate(['layout']);
          return false;
        } else {
          this.router.navigate(['login']);
          return false;
        }
      } else {
        return true;
      }

  }

  hasPermiso(permiso: string): boolean {
  if (localStorage.getItem('permisos') != null) {
    let permisos = JSON.parse(localStorage.getItem('permisos'));
    let a = permisos.find(perm => perm.nombre == permiso);
    if (a != null) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}
}
