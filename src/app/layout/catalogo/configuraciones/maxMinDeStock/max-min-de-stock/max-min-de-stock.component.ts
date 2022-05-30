import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaxMinDeStock } from 'src/app/administracion/modelos/papeleria/maxMinDeStock';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService } from 'src/app/administracion/servicios';


@Component({
  selector: 'app-max-min-de-stock',
  templateUrl: './max-min-de-stock.component.html',
  styleUrls: ['./max-min-de-stock.component.scss']
})
export class MaxMinDeStockComponent implements OnInit {
  maxMinDeStock: MaxMinDeStock = new MaxMinDeStock(); //Objeto de la configuracion maxMinDeStock
  MaxMins: MaxMinDeStock[]; //Arreglo para almacenar las configuraciones
  titulo: string; //Titulo de lapagina html
  displayedColumns: string[] = ['id_config_max_min', 'sucursal', 'usuario_modifico', 'max_stock', 'min_stock', 'fecha_creacion', 'fecha_act', 'action']; //Areglo para establecer los encabezados de cada columna de la tabla
  dataSource = new MatTableDataSource(); //Para almacenar las configuraciones en la Tabla
  maxMinFR = new FormControl('', [Validators.required]); //Form control para validar elformulario
  sucursales: Sucursal[];//Arreglo para almacenar sucursales
  sucursal: Sucursal;//Objeto para almacenar la sucursal
  banderaEditar = true;//Bandera que de ser false oculta el componente select donde se muestran las sucursales
  controlMax = new FormControl();//Form control para el Maximo de Stock

  constructor(private maxMinS: MaxMinStockService,
    private sucursalService: SucursalService) { }

  ngOnInit(): void {
    this.titulo = "Agregar nueva ";
    this.maxMinS.getMaxMinDeStockA().subscribe(//Obetenemos todas las configuraciones existentes
      maxMinss => {
        this.MaxMins = this.filtarSoloActivos(maxMinss);//Aplicamos un filtro para solo obtener las  configuraciones activas
        this.dataSource = new MatTableDataSource(this.MaxMins);//Las configuraciones se cargan  a la tabla
      });
    this.sucursalService.getSucursales().subscribe(val => {//Obtenemos las sucursales disponibles
      this.sucursales = val;//Almacenamos esas sucursales en la variable correspondiente
    });
    this.limpiar();//Para evitar cualquier inconveniente se asignan valores iniciales a variables
  }

  applyFilter(event: Event) {//Metodo que se aplica sobre la tabla de configuraciones y se activa cuando el usuario realiza una busqueda en la tabla
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Método usado simplemente para inicializar variables, sirve también para limpiar el formulario
  public limpiar() {
    this.maxMinDeStock = new MaxMinDeStock();
    this.sucursal = new Sucursal();
    this.banderaEditar = true;
    this.titulo = "Agregar nueva ";
  }

  //Metodo utilizado  cuando el usuario quiere editar una configuracion de la tabla
  cargarMaxMins(id_maxMinDeStock) {
    swal.fire({ //Pregunta el sistema al usuario  si desea realizar un cambio
      title: '¿Desea editar este elemento?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {//En el caso de que el usuario decidió proceder...
        if (id_maxMinDeStock) {//Solo se corrobora que se recibe una variable
          this.maxMinS.getMaxMinDeStock(id_maxMinDeStock).subscribe((response) => {
            if (response) { //Se busca la configuracion en especifica de acuerdo a su id
              this.maxMinDeStock = response //Se carga al objeto asociado con el formulario
              this.banderaEditar = false; //Bandera que desactiva el select de las sucursales
              this.titulo = "Actualizar "; //Cambiar el titulo de la pagina
            } else { }
          })
        }
      }else{
        this.titulo = "Agregar nueva ";
      }
    })
  }

//Metodo utilizado para almacenar o guardar en la base de datos una configuracion nueva
  public create(): void {
    if (this.maxMinDeStock.max_stock && this.maxMinDeStock.min_stock && this.sucursal.nombreSucursal) {//Se valida si el usuario relleno los datos requieridos
      if (this.comprabarConfigExistente() == true) {//Metodo que comprueba que no existe una configuracion existente para la sucursal seleccionada
        swal.fire({ //En caso que ya exista una configuracion se manda al usuario un mensaje informandole
          icon: 'warning',
          title: 'Oops...',
          text: 'Ya existe una configuracion para esa sucursal',
        });
      } else {
        if (this.maxMinDeStock.min_stock > this.maxMinDeStock.max_stock) {//Se valida que el minimo no sea mayor al maximo de Stock
          swal.fire('', 'El mínimo de Stock no puede ser mayor al máximo', 'info'); //Se lanza el mensaje en caso de ocurrir dicho error
        } else {
          swal.fire({//Una vez que se pasaron las validaciones, se pregunta al usuario  si decide guardar la configuracion
            title: '¿Desea guardar este nuevo elemento?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No guardar`,
          }).then((result) => {
            if (result.isConfirmed) { //Si el usuario decide guardar
              this.maxMinDeStock.sucursal = this.sucursal.nombreSucursal;//Se guarda la sucursal
              this.maxMinDeStock.estatus = 1;//El estatus de activo (Default por parte del sistema)
              this.maxMinDeStock.fecha_creacion = new Date();//La fecha actual de creacion de la configuracion
              this.maxMinDeStock.fecha_actualizacion = new Date();//La fecha de actualizacion tambien sería la fecha actual
              this.maxMinDeStock.usuario_modifico = JSON.parse(localStorage.getItem('nombreCUsuario')!);//Obtenemos del local storage el nombre del usuario quien realizó la configuracion
              this.maxMinS.create(this.maxMinDeStock).subscribe(
                maxMiin => {//Se almacena en la base de datos la nueva configuracion
                  this.ngOnInit();//El componente regresa a su estado inicial
                });
              swal.fire('Guardado', `La configuracion fue guardada con éxito!`, 'success'); //Mensaje de confirmacion
            } else if (result.isDenied) {
              swal.fire('El elemento no fue guardado', '', 'info');//Mensaje informando al usuario de que la configuracion no se ha guardao
            }
          });
        }
      }
    } else {//En caso  de que el usuario no relleno o acompleto los datos requeridos se le manda el sig. mensaje
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese todos los datos para continuar',
      })
    }
  }

  //Metodo utilizado para actualizar una configuracion existente
  update(): void {
    if (this.maxMinDeStock.max_stock || this.maxMinDeStock.min_stock) {//Se valida que el usuario relleno los datos requeridos
      swal.fire({
        title: '¿Desea actualizar este elemento?',//Consulta al usuario si desea continuar
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.maxMinDeStock.fecha_actualizacion = new Date();//Consulta al usuario si desea continuar
          this.maxMinS.update(this.maxMinDeStock)//Se actualiza la base d e d atos
            .subscribe(element => {
              this.ngOnInit();//Y se reestablece el componente a su estatus inicial
            })
          swal.fire('Actualizado', `La configuracion se ha actualizado con éxito!`, 'success')//Mensaje de confirmacion
        } else if (result.isDenied) {
          swal.fire('El elemento no fue actualizado', '', 'info');//Mensaje que sale si el usuario decide no actualizar
        }
      });
    } else {//En caso de tener un dato faltante
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',//Mensaje de datos requeridos
      })
    }
  }

  //Metodo mediante el cual filtramos aquellas configuraciones que tengan un estatus 1 (Que esté activo)
  filtarSoloActivos(mmds: MaxMinDeStock[]): MaxMinDeStock[] {
    const activos = mmds.filter(config => config.estatus === 1);
    return activos;
  }

  //Metodo cuya funcion es dar de baja la configuracion seleccionada en la base de datos
  baja(maxMinSt: MaxMinDeStock): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja esta configuracion?',///Metodo cuya funcion es dar de baja la configuracion seleccionada en la base de datos
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) { //Si se desea continuar...
          maxMinSt.estatus = 0;//El estatus de la configuracion cambi a 0 es decir de baja
          this.maxMinS.update(maxMinSt).subscribe(
            (response) => {//Se actualiza la base de datos
              if (response) {//Si actualiza correctamente
                swal.fire(//Mensaje de confirmacion
                  'Mensaje',
                  `La configuracion de la sucursal:  ${response.sucursal} fue dada de baja con éxito`,
                  'success'
                );
                this.ngOnInit();//El componente en cuestion retoma sus valores iniciales
              } else {//Mensaje de error en dato caso de haberlo
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la configuracion`,
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error');
            }
          );
        }
      });
  }

  //Metodo para establecer que el maximo no puede ser meno que el minimo
  validarMaxMin(n: number) {
    this.controlMax = new FormControl(n, Validators.max(n - 1));
  }

  //Mensaje de error en caso de que el valor minimo supere al maximo
  getErrorMessage() {
    return this.controlMax.hasError('max') ? 'El mínimo de Stock no puede ser mayor al máximo' : '';
  }

  //Metodo que comprueba si existe una configuracion para la sucursal seleccionada por el usuario
  comprabarConfigExistente(): Boolean {
    var bandera: boolean;
    for (let i = 0; i < this.MaxMins.length; i++) {//Se recorren todas las configuraciones
      if (this.MaxMins[i].sucursal === this.sucursal.nombreSucursal) { //Si coincide alguna de las configuraciones con la sucursal seleccionada
        bandera = true;//Se activa la bandera
        break;//Se termina el proceso
      } else {
        bandera = false; //Solo se devuelve false
      }
    }
    return bandera;//El metodo devuelve el resultado
  }
}
