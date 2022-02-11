import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../solicitud';
import { SolicitudesService } from '../solicitudes.service';
import { DetalleSolicitudService } from '../detalle-solicitud.service';
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
  date = new Date();
  minDate: Date;
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'action'];
  deta: Detalle_solicitud;
  dataSource = new MatTableDataSource();
  productosSeleccionados = new Set<Producto>();
  producto = new Producto();
  pds = new Array();

  constructor(private productosService: ProductosService,
              private formBuilder: FormBuilder,
              private solicitudesService: SolicitudesService,
              private router: Router,
              private detalleSolicitudService: DetalleSolicitudService)
  {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 1);
  }

  get detalles(): FormArray {
    return this.detalleSForm.get('detalles') as FormArray;
  }

  solicitudForm = this.formBuilder.group({
    nombre_usuario: [''],
    id_sucursal: [''],
    fecha_solicitud: [this.date],
    observacion_solicitud: [''],
  });

  detalleSForm = this.formBuilder.group({
    detalles: this.formBuilder.array([])
  })

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(
      productos => {
        this.pds = productos.filter(p => p.estatus === 1);
        this.dataSource = new MatTableDataSource(this.pds);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  submit(): void {
    if (this.productosSeleccionados.size > 0) {
      this.solicitud = this.solicitudForm.value;
      this.solicitud.estatus = "Pendiente";
      console.log(this.solicitud);

      //this.deta = this.fuga;
      swal.fire({
        title: '¿Desea hacer una nueva solicitud? ',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.solicitudesService.create(this.solicitud).subscribe(
            solicitud => {
              for (var i = 0; i < this.detalles.getRawValue().length; i++) {
                this.deta = this.detalles.value.pop();
                this.deta.solicitud = solicitud;
                console.log(this.deta);
                this.detalleSolicitudService.create(this.deta).subscribe(
                  detalle => {
                    console.log(detalle);
                  }
                )
                console.log(this.deta);
              }
              this.router.navigate(['/layout/solicitudes'])
              //this.ngOnInit();
            })

        } else if (result.isDenied) {
          swal.fire('La solicitud no fue guardada', '', 'info')
        }
      })
    } else {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe de elegir al menos un producto!',
      })
    }
  }

  cancelar(): void {
    swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de cancelar esta solicitud y volver a Solicitudes",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, Cancelar!',
      cancelButtonText: 'Seguir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/layout/solicitudes'])
      }
    })
  }

  eliminarTodo(): void {
    swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de borrar los productos seleccionados para su solicitud",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrar todo!',
      cancelButtonText: 'Seguir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosSeleccionados.clear();
        this.detalles.clear();
      }
    })

  }

  agregarProducto(producto: Producto) {
    if (this.productosSeleccionados.has(producto)) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ya haz seleccionado este producto',
      })
    } else {
      this.productosSeleccionados.add(producto);
      this.agregarDetalles(producto);
    }
  }

  eliminarProducto(index: number) {
    //this.productosSeleccionados.delete(p);
    var i = 0;
    for (let producto of this.productosSeleccionados) {
      if (index === i) {
        this.producto = producto;
      }
      i++;
    }
    this.productosSeleccionados.delete(this.producto);
    this.removerDetalles(index);
  }

  agregarDetalles(p: Producto) {
    const detalleFormC = this.formBuilder.group({
      producto: [p],
      producto_: [{ value: p.descripcion, disabled: true }],
      cant_existente: ['',  {validators: [Validators.required]}],
      cant_solicitada: ['', {validators: [Validators.required]}]
    });

    this.detalles.push(detalleFormC);

  }

  removerDetalles(indice: number) {
    this.detalles.removeAt(indice);
  }

}
