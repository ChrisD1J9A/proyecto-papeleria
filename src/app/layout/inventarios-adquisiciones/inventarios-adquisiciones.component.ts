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
  sucursales: Sucursal[];
  sucursal = new Sucursal();
  inventario = new Inventario();
  detalle_inventario = new Detalle_inventario();
  inventarioBajo = new Array();
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'cant_existente'];
  displayedColumns2: string[] = ['id_inventario', 'sucursal', 'productos', 'cant_existente'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  BanderaMostrar = false;
  mostrarTodos = false;
  nombreSucursalInventarioActual: string;

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

  cargarTodosInventarios()
  {
    this.limpiar();
    this.detalleInvenarioService.getTodosInventarios().subscribe(
      todos => {
        console.log(todos);
        this.BanderaMostrar = false;
        this.mostrarTodos = true;
        this.dataSource = new MatTableDataSource(todos);
        this.inventarioBajo = todos.filter(invent => invent.cant_existente <= 5);
        this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
        swal.fire({
          icon: 'success',
          title: '¡Hecho!',
          text: 'Inventarios cargados',
        });
      }
    )
  }

  limpiar()
  {
    this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
  }

}
