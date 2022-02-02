import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../solicitud';
import { Detalle_solicitud } from '../detalle_solicitud';
import { ProductosService } from 'src/app/layout/catalogo/productos/productos.service';
import { Producto } from 'src/app/layout/catalogo/productos/producto';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss'],
})

export class SolicitudFormComponent implements OnInit {
  solicitud = new Solicitud();
  date = new FormControl(new Date());
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'action'];
  deta: Detalle_solicitud[];
  dataSource = new MatTableDataSource();
  productosSeleccionados = new Set<Producto>();

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(
      productos => {
        this.dataSource = new MatTableDataSource(productos);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregarProducto(producto: Producto)
  {
    this.productosSeleccionados.add(producto);
    //this.deta.push(this.crearNuevoDetalle(producto));
    //this.detalles_solicitud = new MatTableDataSource(this.deta);
  }

  /*eliminarDet(detalle:Detalle_solicitud): void
  {
    const indice = this.deta.indexOf(detalle);
    this.detalles_solicitud.data.slice(indice,1);
  }

  crearNuevoDetalle(producto: Producto): Detalle_solicitud
  {
    return  {
      solicitud: null,
      producto: producto,
      cant_existente: null,
      cant_solicitada: null,
      cant_autorizada: null
    };
  }*/

  eliminarProducto(producto: Producto)
  {
    this.productosSeleccionados.delete(producto);
  }

}
