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
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  BanderaMostrar = false;

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
    if (this.sucursal.idSucursal){
      this.inventarioService.getInventarioBySucursal(this.sucursal.idSucursal).subscribe(
        inventario => {
          this.inventario = inventario;
          console.log(inventario);
          if (inventario == null) {
            this.BanderaMostrar = false;
            this.sucursal = new Sucursal();
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'No se encontró un inventario de esa sucursal',
            })
          }else{
            this.BanderaMostrar = true;
            console.log("llegue hasta aquí");
            this.detalleInvenarioService.getDetallesInventario(this.sucursal.idSucursal).subscribe(
              detas => {
                this.dataSource = new MatTableDataSource(detas);
                this.inventarioBajo = detas.filter(invent => invent.cant_existente <= 5);
                this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
              });
          }
        });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Seleccione alguna sucursal para continuar',
      })
    }
  }

}
