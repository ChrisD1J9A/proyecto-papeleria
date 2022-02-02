import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

import { AuthenticationService } from '../administracion/servicios';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const error = err.error.mensaje || err.error.message ||err.statusText;
            if (err.status === 401) {
                // si se recibe una respuesta 401 automaticamente lo desloguea
                this.authenticationService.logout();
                this.router.navigateByUrl("/login");
                //location.reload(true);
            }
            if (err.status === 404) {
                this.router.navigateByUrl("/404");
            }
            if(err.status === 500){
                swal('Error 500', error + ', contacte al administrador.', 'error');
            }
            if(err.status === 503){
                swal('Error 503', 'El servidor no esta disponible, contacte al administrador.', 'error');
            }
            if(err.status === 408)
            {
                swal('Error 408', 'Tiempo de espera del servidor agotado'+ error, 'error');
            }
            return throwError(error);
        }))
    }
}
