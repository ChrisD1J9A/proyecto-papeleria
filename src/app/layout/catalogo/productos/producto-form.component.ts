import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import { Unidad } from 'src/app/administracion/modelos/papeleria/unidad';
import { UnidadService } from 'src/app/administracion/servicios/papeleria/unidad.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';

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
  bandera: Boolean;

  constructor(private productosService: ProductosService,
              private unidadService: UnidadService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _decimalPipe: DecimalPipe) {
  }

  ngOnInit(): void {
    this.unidadService.getUnidades().subscribe(
      unidades => {
        this.unidades = unidades.filter(u => u.estatus == 1);
      });
    this.cargarProducto();
    this.bandera=false;
  }

  getErrorMessage() {
    return this.descripcionProducto.hasError('required') ? 'Ingrese/seleccione algún dato' : '';
  }

  precio_input1(n: any)
  {
    this.producto.precio_iva = n * 0.16;
    this.producto.precio_total = (this.producto.precio_subtotal + this.producto.precio_iva);
    if (n % 1 == 0) {
        this.bandera =  true;
        console.log(n);
        console.log(this.bandera);
    } else {
        this.bandera = false;
        console.log(n);
        console.log(this.bandera);
    }
    //{{ this.producto.precio_subtotal | number: 1.2-2:'fr'}}
  }

  precio_input2(n: any)
  {
    this.producto.precio_total = (this.producto.precio_subtotal + this.producto.precio_iva);
    //this.producto.precio_total.toFixed(2);
  }

  cargarProducto(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.productosService.getProducto(id).subscribe(
          (producto) => this.producto = producto
        )};
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
          //this.producto.precio_subtotal =  Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(this.producto.precio_subtotal;
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
