import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  producto = new Producto();
  displayedColumns: string[] = ['id_producto', 'descripcion', 'precio_subtotal', 'precio_iva', 'precio_total', 'estatus', 'observaciones', 'id_unidad', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private productosService: ProductosService, private activatedRoute: ActivatedRoute) { }

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

  baja(producto: Producto): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja este Producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          producto.estatus = 0;
          this.productosService.update(producto).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El producto:  ${response.descripcion} fue dado de baja con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el producto`,
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

  activar(producto: Producto): void {
    swal
      .fire({
        title: '¿Está seguro de activar este Producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          producto.estatus = 1;
          this.productosService.update(producto).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El producto:  ${response.descripcion} fue activado con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el producto`,
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

}
