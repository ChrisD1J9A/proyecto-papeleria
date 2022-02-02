import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

    constructor(public router: Router) {}
    private roles: any = localStorage.getItem('roles');
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
        //se obtienen los roles que pueden acceder a la ruta especificada
        const rolesEsperados = next.data.roles;
        //se obtienen los roles con los que cuenta el usuario
        let roles = JSON.parse(this.roles);

        for(let rol of roles.roles)
        {
            for(let rolEsperado of rolesEsperados)
            {
                if(rol.authority === rolEsperado)
                {
                    //si el rol que tiene el usuario tiene acceso al recuerso, regresa true
                    return true;
                }
            }
        }
    this.router.navigate(['403']);
    return false;
  }
}
