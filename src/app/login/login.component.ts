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
  error: boolean;
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
      }, (err)=>{
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
      });
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

                    if(roles.roles[i].idSistema==9){
                        //Se guarda la sucursal dondese logea
                        localStorage.setItem('sucursalIngresa',JSON.stringify(roles.roles[i].sucursalIngresa));
                        //Guarda las sucursales que tiene permitido el usuario operar
                        localStorage.setItem('sucursalesPermitidas', JSON.stringify(roles.roles[i].sucursales));
                        //Se guarda el id de la sucursal donde se logea
                        localStorage.setItem('idSucursal', JSON.stringify(roles.roles[i].idSucursal));
                        //Se guardan los permisos que tiene el usuario que inicio sesión
                        localStorage.setItem('permisos', JSON.stringify(roles.roles[i].hijos));
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
