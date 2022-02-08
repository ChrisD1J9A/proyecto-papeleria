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
  date = new FormControl(new Date());
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'action'];
  deta: Detalle_solicitud;
  fuga: any;
  dataSource = new MatTableDataSource();
  productosSeleccionados = new Set<Producto>();
  producto = new Producto();

  constructor(private productosService: ProductosService, private formBuilder: FormBuilder, private solicitudesService: SolicitudesService, private router: Router, private detalleSolicitudService: DetalleSolicitudService) { }

  get detalles(): FormArray {
    return this.detalleSForm.get('detalles') as FormArray;
  }

  solicitudForm = this.formBuilder.group({
    nombre_usuario: [''],
    id_sucursal: [''],
    fecha_solicitud: [new Date()],
    observacion_solicitud: ['Deje aquí sus Comentarios u observaciones a cerca de la solicitud...'],
  });

  detalleSForm = this.formBuilder.group({
    detalles: this.formBuilder.array([])
  })

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

  submit() {
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
              this.detalleSolicitudService.create(this.deta).subscribe(
                detalle => {
                  console.log(detalle);
                }
              )
              console.log(this.deta);
            }
            this.router.navigate(['/layout/solicitudes'])
            this.ngOnInit();
          })

      } else if (result.isDenied) {
        swal.fire('La solicitud no fue guardada', '', 'info')
      }
    })
  }

  agregarProducto(producto: Producto) {
    this.productosSeleccionados.add(producto);
    this.agregarDetalles(producto);
    this.producto = producto;
  }

  eliminarProducto(producto: Producto, index: number) {
    this.productosSeleccionados.delete(producto);
    this.removerDetalles(index);
  }

  agregarDetalles(p: Producto) {
    const detalleFormC = this.formBuilder.group({
      producto_obj: [p],
      producto: [{ value: p.descripcion, disabled: true }],
      cant_existente: [''],
      cant_solicitada: ['']
    });

    this.detalles.push(detalleFormC);
  }

  removerDetalles(indice: number) {
    this.detalles.removeAt(indice);
  }

}
