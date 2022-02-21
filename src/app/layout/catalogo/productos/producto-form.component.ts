import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Producto } from './producto';
import { ProductosService } from './productos.service';
import { Unidad } from 'src/app/layout/catalogo/configuraciones/unidad/unidad';
import { UnidadService } from 'src/app/layout/catalogo/configuraciones/unidad/unidad.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {
  titulo: string = "Agregar nuevo Producto";
  titulo2: string = "Editar Producto";
  producto = new Producto();
  productos: Producto[];
  unidad: Unidad = new Unidad();
  unidades: Unidad[];
  descripcionProducto = new FormControl('', [Validators.required]);
  unidadProducto = new FormControl('', [Validators.required]);

  constructor(private productosService: ProductosService, private unidadService: UnidadService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.unidadService.getUnidades().subscribe(
      unidades => {
        this.unidades = unidades
      });
    this.cargarProducto();
  }

  getErrorMessage() {
    return this.descripcionProducto.hasError('required') ? 'Ingrese/seleccione algún dato' : '';
  }

  precio_input1(n: any)
  {
    this.producto.precio_iva = n * 0.16;
    this.producto.precio_total = this.producto.precio_subtotal + this.producto.precio_iva;
  }

  precio_input2(n: any)
  {
    this.producto.precio_total = this.producto.precio_subtotal + this.producto.precio_iva;
  }

  cargarProducto(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.productosService.getProducto(id).subscribe(
          (producto) => this.producto = producto
        )
      }
    })
  }

  public create(): void {
    if (this.producto.descripcion) {
      swal.fire({
        title: '¿Desea guardar este nuevo elemento? ',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.producto.estatus = 1;
          this.productosService.create(this.producto).subscribe(
            response => {
              this.router.navigate(['/layout/productos'])
              this.ngOnInit();
            })
          swal.fire('Guardado', `El producto ${this.producto.descripcion} fue guardado con éxito!`, 'success')
        } else if (result.isDenied) {
          swal.fire('El elemento no fue guardado', '', 'info')
        }
      })
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  public update(): void {
    if (this.producto.descripcion) {
      swal.fire({
        title: '¿Desea actualizar este elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          //  this.unidad.estatus = 1;
          this.productosService.update(this.producto)
            .subscribe(producto => {
              this.router.navigate(['/layout/productos'])
              this.ngOnInit();
            })
          swal.fire('Actualizado', `El Producto ${this.producto.descripcion} actualizado con éxito!`, 'success')
        } else if (result.isDenied) {
          swal.fire('El elemento no fue actualizado', '', 'info')
        }
      })
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  public cancel(): void
  {
    this.router.navigate(['/layout/productos'])
    this.ngOnInit();
  }
}
