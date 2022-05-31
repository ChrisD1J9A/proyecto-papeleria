import { Component, OnInit } from '@angular/core';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService } from 'src/app/administracion/servicios';
import { MatTableDataSource } from '@angular/material/table';
import { Inventario } from '../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../administracion/modelos/papeleria/detalle_inventario';
import { InventarioService } from '../../administracion/servicios/papeleria/inventario.service';
import { DetalleInventarioService } from '../../administracion/servicios/papeleria/detalle-inventario.service';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios-adquisiciones',
  templateUrl: './inventarios-adquisiciones.component.html',
  styleUrls: ['./inventarios-adquisiciones.component.scss']
})
export class InventariosAdquisicionesComponent implements OnInit {
  sucursales: Sucursal[]; //Lista de sucursales
  sucursal = new Sucursal(); //Objeto sucursal, sirve para almacenar la sucursal elegida en el select
  inventario = new Inventario();//Objeto inventario, sirve para almacenar el inventario de la sucursal elegida
  detalle_inventario = new Detalle_inventario();//Objeto detalle_inventario del inventario elegido
  inventarioBajo = new Array();//Lista para almacenar los productos con stock bajo
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'cant_existente']; //Encabezados para la tabla del inventario seleccioado
  displayedColumns2: string[] = ['id_inventario', 'sucursal', 'productos', 'cant_existente'];//Encabezados para la  tabla de todos los inventarios
  dataSource = new MatTableDataSource();//Dónde se carga la informacion del inventario para mostrar en la tabla
  dataSource2 = new MatTableDataSource();//Donde se cargan los datos de todos los inventarios para mostrar en su respectiva tabla
  BanderaMostrar = false; //Bandera con la cual evalua si se muestran o no el inventario de X sucursal
  mostrarTodos = false;//Bandera para mostrar o no todos los inventarios
  nombreSucursalInventarioActual: string;//Variable para almacenar el nombre de la sucursal seleccionada
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock

  constructor(private sucursalService: SucursalService,
              private inventarioService: InventarioService,
              private detalleInvenarioService: DetalleInventarioService,
              private maxMinStockService: MaxMinStockService) { }

  //Se obtienen las sucursales para poder mostrarlos en un select
  //Y el usuario seleccione el inventario de una sucursal
  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe(val => {
      this.sucursales = val;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

/** Una vez seleccionada la sucursal este metodo buscará el inventario correspondiente y lo mostrara en  su tabla */
  cargarInventario() {
    this.limpiar();//Limpia las listas para evitar errores
    if (this.sucursal.idSucursal){//Obtenemos la sucursal seleccionada por el usuario
      this.inventarioService.getInventarioBySucursal(this.sucursal.idSucursal).subscribe(
        inventario => {//Obtenemos el inventario mediante el id de la sucursal
          this.inventario = inventario;//almacenamos el inventario en el objeto
          //Se cargan los maximos y minimos de la sucursal del seleccionado inventario
          //De ser null el inventario quiere decir que no hay inventario para esa sucursal en la base de datos
          if (inventario == null) {
            this.BanderaMostrar = false; //No muestra el inventario particular
            this.mostrarTodos = false;//No muestra la tabla general de todos los inventarios
            this.sucursal = new Sucursal();//Se limpia la sucursal seleccionada
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'No se encontró un inventario de esa sucursal',//Se informa al usuario de que no hay inventario
            })
          }else{
            this.obtenerMaximosMinimosDeLaSucursal(inventario);
            this.nombreSucursalInventarioActual = this.sucursal.nombreSucursal;//Guardamos el nombre
            this.BanderaMostrar = true;//Muestra el inventario de la sucursal
            this.mostrarTodos = false;
            //Se cargan los detalles de ese inventario, se hizo la busqueda en la base de datos mediante el id_inventario
            this.detalleInvenarioService.getDetallesInventario(this.inventario.id_inventario).subscribe(
              detas => {
                this.dataSource = new MatTableDataSource(detas);//Se carga a la tabla
                //Se hace un filtro para determinar stock bajo
                this.inventarioBajo = detas.filter(invent => invent.cant_existente <= this.minStock);
                //Se carga el stock bajo en su propia tabla
                this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
                swal.fire({
                  icon: 'success',
                  title: '¡Hecho!',
                  text: 'Inventario cargado', //Mensaje de que el inventario se cargó exitosamente
                });
              });
          }
        });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Seleccione alguna sucursal para continuar', //Mensaje de advertencia, el usuario forzosamente debe de seleccionar una sucursal
      });
    }
  }

//Metodo para cargar todos los inventarios almacenados en la bd
  cargarTodosInventarios()
  {
    this.limpiar(); //Limpia las tablas antes de almacenar nueva informacion
    //Se hace una consulta en la bd de todos los inventarios
    this.detalleInvenarioService.getTodosInventarios().subscribe(
      todos => {
        //La bandera para mostrar un inventario individual se desactiva
        this.BanderaMostrar = false;
        //Bandera de mostrar todos los inventarios se activa
        this.mostrarTodos = true;
        //Se cargan los inventarios a la tabla
        this.dataSource = new MatTableDataSource(todos);
        //Se hace un filtro para conocer los inventarios con stock bajo
        this.inventarioBajo = todos.filter(invent => invent[3] <= 5);
        //Se cargan los datos filtrados anteriormente
        this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
        swal.fire({
          icon: 'success',
          title: '¡Hecho!',
          text: 'Inventarios cargados',//Mensaje de confirmacion
        });
      }
    )
  }

//Metodo para limpiar las tablas de los inventarios
  limpiar()
  {
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
  al que le pertenezca el inventario y se almacenan dichas configuraciones en el variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal(inventario: Inventario)
  {
    var nombreSucursal = inventario.nombre_sucursal;
    this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(
      maxMinStockSucursal => {
        if(maxMinStockSucursal === null){
          this.maxStock = 50;
          this.minStock = 5;
        }else{
          this.maxStock = maxMinStockSucursal.max_stock;
          this.minStock = maxMinStockSucursal.min_stock;
        }
      });
  }
}
