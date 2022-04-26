import { Component, OnInit } from '@angular/core';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService } from 'src/app/administracion/servicios';
import { MatTableDataSource } from '@angular/material/table';
import { Inventario } from '../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../administracion/modelos/papeleria/detalle_inventario';
import { InventarioService } from '../../administracion/servicios/papeleria/inventario.service';
import { DetalleInventarioService } from '../../administracion/servicios/papeleria/detalle-inventario.service';
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

  constructor(private sucursalService: SucursalService,
    private inventarioService: InventarioService,
    private detalleInvenarioService: DetalleInventarioService) { }

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
    this.limpiar();
    if (this.sucursal.idSucursal){
      this.inventarioService.getInventarioBySucursal(this.sucursal.idSucursal).subscribe(
        inventario => {
          this.inventario = inventario;
          this.nombreSucursalInventarioActual = this.sucursal.nombreSucursal;
          console.log(inventario);
          if (inventario == null) {
            this.BanderaMostrar = false;
            this.mostrarTodos = false;
            this.sucursal = new Sucursal();
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'No se encontró un inventario de esa sucursal',
            })
          }else{
            this.BanderaMostrar = true;
            this.mostrarTodos = false;
            this.detalleInvenarioService.getDetallesInventario(this.inventario.id_inventario).subscribe(
              detas => {
                this.dataSource = new MatTableDataSource(detas);
                this.inventarioBajo = detas.filter(invent => invent.cant_existente <= 5);
                this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
                swal.fire({
                  icon: 'success',
                  title: '¡Hecho!',
                  text: 'Inventario cargado',
                });
              });
          }
        });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Seleccione alguna sucursal para continuar',
      });
    }
  }

//Metodo para cargar todos los inventarios almacenados en la bd
  cargarTodosInventarios()
  {
    this.limpiar(); //Limpia las tablas antes de almacenar nueva informacion
    this.detalleInvenarioService.getTodosInventarios().subscribe( //Se hace una consulta en la bd de todos los inventarios
      todos => {
        console.log(todos);
        this.BanderaMostrar = false; //La bandera para mostrar un inventario individual se desactiva
        this.mostrarTodos = true;//Bandera de mostrar todos los inventarios se activa
        this.dataSource = new MatTableDataSource(todos);//Se cargan los inventarios a la tabla
        this.inventarioBajo = todos.filter(invent => invent.cant_existente <= 5);//Se hace un filtro para conocer los inventarios con stock bajo
        this.dataSource2 = new MatTableDataSource(this.inventarioBajo); //Se cargan los datos filtrados anteriormente
        swal.fire({
          icon: 'success',
          title: '¡Hecho!',
          text: 'Inventarios cargados',
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

}
