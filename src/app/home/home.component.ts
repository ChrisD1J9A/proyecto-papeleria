import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/administracion/modelos/usuario.service';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {

    constructor(private usuarioService: UsuarioService) {}

    username: any
    idSuc: any
    fullusername: any

    ngOnInit() {
        this.username=JSON.parse(localStorage.getItem('currentUser')!).username;
        //this.idSuc = JSON.parse(localStorage.getItem('idSucursal')!);
        this.obtenerNombreUsuario();
        //this.fullusername = JSON.parse(localStorage.getItem('nombreCUsuario')!);
        //console.log(this.fullusername);
        //console.log(this.idSuc);
    }

    /*Metodo obtenerNombreUsuario
    Sirve para obtener el nombre complete del usuario que se logeo  y almacenar el mismo en un localStorage
    con el identificador nombreCUsuario*/
    obtenerNombreUsuario(): void
    {
      var username = JSON.parse(localStorage.getItem('currentUser')!).username; //En el login se guardó el nombre de usuario que se ingresó, aca solo se recupera
      var nombreCompleto: String; //Variable que almacena el nombre completo del usuario para usarlo durante el sistema
      this.usuarioService.getUsername(username) //Buscarmos el usuario mediante el username
      .toPromise()
      .then((usuario) => {
          nombreCompleto = usuario.empleado.nombre +
          ' ' +
          usuario.empleado.apellidoPat +
          ' ' +
          usuario.empleado.apellidoMat; //Obtenemos sus nombres y apellidos para concatenarlos en la variable nombreCompleto

          localStorage.setItem('nombreCUsuario',
          JSON.stringify(nombreCompleto));//Gugardamos el nombre completo en un local localStorage
        });
    }
}
