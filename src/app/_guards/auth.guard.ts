import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        if (localStorage.getItem('currentUser')) {
            // si estas logueado regresa true
            return true;
        }
        // Si no estas logueado te redirecciona a la pagina de login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
