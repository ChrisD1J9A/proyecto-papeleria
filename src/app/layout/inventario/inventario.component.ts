import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Inventario } from '../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../administracion/modelos/papeleria/detalle_inventario';
import { InventarioService } from '../../administracion/servicios/papeleria/inventario.service';
import { DetalleInventarioService } from '../../administracion/servicios/papeleria/detalle-inventario.service';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  inventario = new Inventario();
  detalle_inventario = new Detalle_inventario();
  inventarioBajo = new Array();
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'cant_existente'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();


  constructor(private inventarioService: InventarioService,
              private detalleInvenarioService: DetalleInventarioService)
              { }

  ngOnInit(): void
  {
    this.cargarInventario();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  cargarInventario()
  {
    this.inventarioService.getInventario(1).subscribe(
      inventario => {
        this.inventario = inventario;
      });
    this.detalleInvenarioService.getDetallesInventario(1).subscribe(
      detas => {
        this.dataSource = new MatTableDataSource(detas);
        this.inventarioBajo = detas.filter(invent => invent.cant_existente <= 5);
        this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
        //console.log(this.inventarioBajo);
      });
  }

}
