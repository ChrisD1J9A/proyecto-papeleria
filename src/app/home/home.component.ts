import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/administracion/modelos/usuario.service';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {

    constructor(private usuarioService: UsuarioService,
                private maxMinStockService: MaxMinStockService,
                private maxMinExistenciaService: MaxMinExistenciaService) {}

    username: any
    idSuc: any
    fullusername: any

    ngOnInit() {
        this.username=JSON.parse(localStorage.getItem('currentUser')!).username;
        this.idSuc = JSON.parse(localStorage.getItem('idSucursal')!);
        this.obtenerNombreUsuario();
        this.obtenerMaximosMinimosDeLaSucursal();
        this.fullusername = JSON.parse(localStorage.getItem('nombreCUsuario')!);
        console.log(this.fullusername);
        console.log(this.idSuc);
    }

    /*Metodo obtenerNombreUsuario
    Sirve para obtener el nombre complete del usuario que se logeo  y almacenar el mismo en un localStorage
    con el identificador nombreCUsuario*/
    obtenerNombreUsuario(): void
    {
      var username = JSON.parse(localStorage.getItem('currentUser')!).username;
      var nombreCompleto: String;
      this.usuarioService.getUsername(username)
      .toPromise()
      .then((usuario) => {
          nombreCompleto = usuario.empleado.nombre +
          ' ' +
          usuario.empleado.apellidoPat +
          ' ' +
          usuario.empleado.apellidoMat;
          console.log(nombreCompleto);

          localStorage.setItem('nombreCUsuario',
          JSON.stringify(nombreCompleto));
        });
    }

    /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
    donde se esta logeando y se almacenan dichas configuraciones en el localStorage*/
    obtenerMaximosMinimosDeLaSucursal()
    {
      var nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!);
      this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(
        maxMinStockSucursal => {
          localStorage.setItem('maxStock', JSON.stringify(maxMinStockSucursal.max_stock));
          localStorage.setItem('minStock', JSON.stringify(maxMinStockSucursal.min_stock));
        });

      this.maxMinExistenciaService.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(
        maxMinExistenciaSucursal => {
          localStorage.setItem('maxExistencia', JSON.stringify(maxMinExistenciaSucursal.max_existencia));
          localStorage.setItem('minExistencia', JSON.stringify(maxMinExistenciaSucursal.min_existencia));
        });
    }
}
