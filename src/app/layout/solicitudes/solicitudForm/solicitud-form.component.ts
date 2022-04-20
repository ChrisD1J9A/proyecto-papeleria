import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/administracion/modelos/papeleria/solicitud';
import { SolicitudesService } from 'src/app/administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from 'src/app/administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud } from 'src/app/administracion/modelos/papeleria/detalle_solicitud';
import { DetalleSolicitudPFDCService } from 'src/app/administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { Detalle_solicitud_PFDC } from 'src/app/administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/administracion/modelos/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class SolicitudFormComponent implements OnInit {
  solicitud = new Solicitud();
  date = new Date();
  minDate: Date;
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'action'];
  deta: Detalle_solicitud;
  deta2: Detalle_solicitud_PFDC;
  dataSource = new MatTableDataSource();
  productosSeleccionados = new Set<Producto>();
  producto = new Producto();
  pds = new Array();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!);
  idSucursal: any;
  nombre_usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);
  maxStock = JSON.parse(localStorage.getItem('maxStock')!);
  minStock = JSON.parse(localStorage.getItem('minStock')!);
  maxExistencia = JSON.parse(localStorage.getItem('maxExistencia')!);
  minExistencia = JSON.parse(localStorage.getItem('minExistencia')!);


  constructor(private productosService: ProductosService,
    private formBuilder: FormBuilder,
    private solicitudesService: SolicitudesService,
    private router: Router,
    private detalleSolicitudService: DetalleSolicitudService,
    private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
    private _snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 12, 31);
  }

  //Formularios reactivos
  get detalles(): FormArray {
    return this.detalleSForm.get('detalles') as FormArray;
  }

  get detalles2(): FormArray {
    return this.detalleSPFDCForm.get('detalles2') as FormArray;
  }

  solicitudForm = this.formBuilder.group({
    nombre_usuario: [this.nombre_usuario],
    id_sucursal: [this.nombreSucursal],
    fecha_solicitud: [this.date],
    observacion_solicitud: [''],
  });

  detalleSForm = this.formBuilder.group({
    detalles: this.formBuilder.array([])
  })

  detalleSPFDCForm = this.formBuilder.group({
    detalles2: this.formBuilder.array([])
  })

  /*Al iniciar este componente se cargaran al dataSource (para la tabla de productos)
  los productos activos (1) para mostrarlos en el formulario*/
  ngOnInit(): void {
    this.productosService.getProductos().subscribe(
      productos => {
        this.pds = productos.filter(p => p.estatus === 1);
        this.dataSource = new MatTableDataSource(this.pds);
      });
    this.idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*Método en dónde una vez que se decida envíar una solicitud,validará los datos y si no hay
  inconvenientes se guarda la solicitud*/
  submit(): void {
    console.log(this.detalles2.getRawValue().length)
    if (this.productosSeleccionados.size > 0) {
      if (this.detalles.valid) {
        this.solicitud = this.solicitudForm.value;
        this.solicitud.estatus = "Pendiente";
        this.solicitud.id_sucursal = this.idSucursal;
        this.solicitud.nombre_sucursal = this.nombreSucursal;
        if (this.detalles2.getRawValue().length >= 1) {
          this.solicitud.pfdc = true;
        } else {
          this.solicitud.pfdc = false;
        }
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
                      console.log("done");
                    });
                  console.log(this.deta);
                }
                if (this.detalles2.getRawValue().length >= 1) {
                  for (var i = 0; i < this.detalles2.getRawValue().length; i++) {
                    this.deta2 = this.detalles2.value.pop();
                    this.deta2.solicitud = solicitud;
                    this.detalleSolicitudPFDCService.create(this.deta2).subscribe(
                      detalle2 => {
                        console.log("done");
                      });
                    console.log(this.deta2);
                  }
                }


                if (solicitud.id_solicitud) {
                  swal.fire(
                    'Mensaje',
                    `La solicitud fue enviada con éxito y queda como ${solicitud.estatus}`,
                    'success'
                  );
                  this.router.navigate(['/layout/solicitudes'])
                } else {
                  swal.fire(
                    'Mensaje',
                    `Error al envíar la solicitud`,
                    'error'
                  );
                }
              })

          } else if (result.isDenied) {
            swal.fire('La solicitud no fue guardada', '', 'info');
          }
        })
      }else{
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hay datos inválidos en el formulario',
        });
      }
    }else {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe de elegir al menos un producto!',
      });
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
        this.detalles2.clear();
        this.ngOnInit();
      }
    })

  }

  snackBarSuccess() {
    this._snackBar.open('Producto seleccionado ✔️', 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
      panelClass: ['mySnackbarSucess']
    });
  }

  snackBarDelete() {
    this._snackBar.open('Producto removido ❌', 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
      panelClass: ['mySnackbarDelete']
    });
  }

  agregarProducto(producto: Producto) {
    var indice = this.pds.findIndex(p => p === producto); //Aquí se obtiene el indice del producto seleccioado
    this.pds.splice(indice, 1); //se elimiina de la lista el producto seleccionado
    this.dataSource = new MatTableDataSource(this.pds); //y se vuelve a cargar ala tabla.
    this.snackBarSuccess();
    this.productosSeleccionados.add(producto); // añade el producto seleccionado a una lista auxiliar
    this.agregarDetalles(producto); //agregar el formulario para el producto que se selecciono
    //}
  }

  agregarProductoFueraDelCatalogo() {
    this.agregarDetallesPFDC();
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
    this.pds.push(this.producto);
    this.pds.sort((a, b) => a.id_producto - b.id_producto);
    this.dataSource = new MatTableDataSource(this.pds);
    this.productosSeleccionados.delete(this.producto);
    this.removerDetalles(index);
    this.snackBarDelete();
  }

  agregarDetalles(p: Producto) {
    const detalleFormC = this.formBuilder.group({
      producto: [p],
      producto_: [p.descripcion],
      cant_existente: ['0', { validators: [Validators.required, Validators.min(0), Validators.max(this.minExistencia)] }],
      cant_solicitada: ['0', { validators: [Validators.required, Validators.min(1), Validators.max(this.maxExistencia)] }]
    });
    this.detalles.push(detalleFormC);
  }

  agregarDetallesPFDC() {
    const detallePFDCFormC = this.formBuilder.group({
      nombreProducto: ['', { validators: [Validators.required] }],
      cant_existente: ['0', { validators: [Validators.required] }],
      cant_solicitada: ['0', { validators: [Validators.required] }]
    });
    this.detalles2.push(detallePFDCFormC);
  }

  removerDetalles(indice: number) {
    this.detalles.removeAt(indice);
  }

  removerDetalles2(indice: number) {
    this.detalles2.removeAt(indice);
  }
}
