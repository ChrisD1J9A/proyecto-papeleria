import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Usuario } from '../administracion/modelos';
import { Sucursal } from '../administracion/modelos/sucursal';
import { AuthenticationService, SucursalService, UsuarioService } from '../administracion/servicios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  returnUrl!: string;
  usuario :Usuario = new Usuario();
  error = '';
  sucursal= '';
  sucursales!: Sucursal[];
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private sucursalService:SucursalService) {}

  ngOnInit() {
      //cierra las ventanas modales de la libreria sweetalert
      Swal.close();
      // reset login status
      //this.authenticationService.logout();

      this.sucursalService.getSucursales().subscribe(val=>{
          this.sucursales=val;

      })
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
      this.loading = true;
      
      this.authenticationService.login(this.usuario,this.sucursal)
          .pipe(first())
          .subscribe(
              data => {
                let roles = JSON.parse(localStorage.getItem('roles')!);
                
                let bandera = false;
                for(let i= 0;i<roles.roles.length;i++){
                   
                    if(roles.roles[i].idSistema==2){
                        localStorage.setItem('sucursalIngresa',JSON.stringify(roles.roles[i].sucursalIngresa))
                        bandera = true;
                    }
                }

                if(bandera){
                    this.router.navigate(['/layout/']);
                } else {
                    Swal.fire('Atencion',"¡No tienes acceso al sistema!\nPonte en contacto con TI.","warning")
                    this.loading = false;
                    localStorage.clear();
                }
               
                 
              },
              error => {
                  Swal.fire('Atencion',"¡No tienes permisos en esta sucursal!\nPonte en contacto con TI.","warning")
                  this.loading = false;
              });
  }
}
