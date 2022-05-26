import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  producto = new Producto(); //Obejto producto
  displayedColumns: string[] = ['id_producto', 'descripcion', 'precio_subtotal', 'precio_iva', 'precio_total', 'estatus', 'id_unidad', 'action'];//Encabezados de la tabla de productos
  dataSource = new MatTableDataSource();//Lista donde se almacenaran los productos en la tabla

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(//Se obtieen todos los  productos de la base de datos
      productos => {
        this.dataSource = new MatTableDataSource(productos); //Se cargan los productos de la bd en la tabla
      });
  }

//Metodo para ubicar un elemento en la tabla, deacuerdo a lo que el usuario ingrese
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

//Metodo para dar de baja un producto en la base de datos
  baja(producto: Producto): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja este Producto?',// Se pregunta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          producto.estatus = 0;//El estatus cambia a 0, es decir desactivado
          this.productosService.update(producto).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El producto:  ${producto.descripcion} fue dado de baja con éxito`,//Mensaje de confirmacion exitoso
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el producto`, //Mensaje de error
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error');//Mensaje de error
            }
          );
        }
      });
  }

//Metodo para activar un productos en la base de datos
  activar(producto: Producto): void {
    swal
      .fire({
        title: '¿Está seguro de activar este Producto?', //Se consulta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          producto.estatus = 1;//El estatus cambia a 1, es decir activado
          this.productosService.update(producto).subscribe( //Se actualiza el producto en la base de datos
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El producto:  ${producto.descripcion} fue activado con éxito`, //Mensaje exitoso
                  'success'
                );
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el producto`, //Mensaje de error
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
