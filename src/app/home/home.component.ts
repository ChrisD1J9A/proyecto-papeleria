import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/administracion/modelos/usuario.service';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {

    constructor(private usuarioService: UsuarioService) {}

    username: any
    idSuc: any
    fullusername: any

    ngOnInit() {
        //Obtiene el nombre de usuario para mostrarlo en la bienvenida
        this.username=JSON.parse(localStorage.getItem('currentUser')!).username;
        //Método que obtiene el nombre completo del usuario
        this.obtenerNombreUsuario();
    }

    /*Metodo obtenerNombreUsuario, sirve para obtener el nombre completo del
    usuario que se logeo  y almacenar el mismo en un localStorage con el
    identificador nombreCUsuario*/
    obtenerNombreUsuario(): void
    {
      //En el login se guardó el nombre de usuario que se ingresó, aca solo se recupera
      var username = JSON.parse(localStorage.getItem('currentUser')!).username;
      //Variable que almacena el nombre completo del usuario para usarlo durante el sistema
      var nombreCompleto: String;
      this.usuarioService.getUsername(username) //Buscarmos el usuario mediante el username
      .toPromise()
      .then((usuario) => {
        //Obtenemos sus nombres y apellidos para concatenarlos en la variable nombreCompleto
          nombreCompleto = usuario.empleado.nombre +
          ' ' +
          usuario.empleado.apellidoPat +
          ' ' +
          usuario.empleado.apellidoMat;

          localStorage.setItem('nombreCUsuario',
          JSON.stringify(nombreCompleto));//Gugardamos el nombre completo en un local localStorage
        });
    }
}
