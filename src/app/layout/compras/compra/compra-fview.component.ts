import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { Proveedor } from '../../../administracion/modelos/papeleria/proveedor';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { Inventario } from '../../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../../administracion/modelos/papeleria/detalle_inventario';
import { ProveedoresService } from '../../../administracion/servicios/papeleria/proveedores.service';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { InventarioService } from '../../../administracion/servicios/papeleria/inventario.service';
import { DetalleSolicitudService  } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { DetalleInventarioService } from '../../../administracion/servicios/papeleria/detalle-inventario.service'
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-compra-fview',
  templateUrl: './compra-fview.component.html',
  styleUrls: ['./compra-fview.component.scss']
})
export class CompraFViewComponent implements OnInit {
  compra = new Compra();
  detalle_compra = new Detalle_compra();
  detalles_compra = new Array();
  detalles_inventario: Detalle_inventario[];
  proveedor = new Proveedor();
  proveedores: Proveedor[];
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada'];
  dataSource = new MatTableDataSource();
  nombreProveedor: String;
  banderaEditar: Boolean;
  private ticket: File;
  fecha_compra = new FormControl('', [Validators.required]);
  numericos = new FormControl('', [Validators.required]);
  mensajet = "Ticket no seleccionado";
  today = new Date();
  minDate: Date;

  constructor(private comprasService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private proveedoresService: ProveedoresService,
    private inventarioService: InventarioService,
    private detaInventarioService: DetalleInventarioService,
    private detaSolicitudService: DetalleSolicitudService,
    private router: Router, private activatedRoute: ActivatedRoute)
    {
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 1, 12, 31);
    }

  ngOnInit(): void {
    this.cargarCompra();
    this.proveedoresService.getProveedores().subscribe(
      proveedores => {
        this.proveedores = proveedores;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getErrorMessage() {
    return this.fecha_compra.hasError('required') ? 'Seleccione una fecha' : '';
  }

  getErrorMessage2() {
    return this.numericos.hasError('required') ? 'Rellene el campo con un valor mayor a cero' : '';
  }

  cargarCompra(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.comprasService.getCompra(id).subscribe(
          (compra) => {
            this.compra = compra;
            this.proveedor = this.compra.proveedor;
            if (this.proveedor) {
              this.nombreProveedor = this.proveedor.nombre;
            } else {
              this.nombreProveedor = "";
            }
            console.log(this.nombreProveedor);
            if (compra.estatus == 'Completada') {
              this.banderaEditar = false;
            } else {
              this.banderaEditar = true;
            }
            console.log(this.banderaEditar);
          })
        this.detalleCompraService.getDetallesCompra(id).subscribe(
          deta_compra => {
            this.dataSource = new MatTableDataSource(deta_compra);
            console.log(deta_compra);
          });
      }
    })
  }

  subirTicket(event) {
    this.ticket = event.target.files[0];
    if(this.ticket)
    {
      this.mensajet = this.ticket.name;
    }else{
      this.mensajet = "Ticket no seleccionado";
    }
  }

  validarDetalles(): boolean {
    let bandera = false;
    this.detalles_compra = this.dataSource.data;
    for (this.detalle_compra of this.detalles_compra) {
      if (this.detalle_compra.cant_comprada == null || this.detalle_compra.cant_comprada < 1) {
        bandera = true;
      }
    }
    return bandera;
  }

  guardarCompra() {
    console.log(this.validarDetalles());
    if (this.validarDetalles()) {
      swal.fire('Para guardar la compra debe de ingresar un valor diferente de cero o válido en la cantidad comprada', '', 'info');
    } else {
      if (this.ticket && this.compra.gasto_total && this.compra.fecha_creacion) {
        swal.fire({
          title: '¿Desea guardar esta compra? ',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.compra.estatus = "Completada";
            //this.detalles_compra = this.dataSource.data;
            this.comprasService.update(this.compra).subscribe(
              compra => {
                this.comprasService.cargarTicket(this.ticket, compra.id_compra).
                  subscribe(compra => {
                    console.log(compra);
                  });
                this.detalleCompraService.update(this.detalles_compra, compra.id_compra).subscribe(
                  detalles => {
                    if (detalles) {
                      swal.fire(
                        'Mensaje',
                        `La compra:  ${compra.id_compra} fue guardada con éxito`,
                        'success'
                      );
                      //this.crearCompra()
                      this.router.navigate(['/layout/compras'])
                    } else {
                      swal.fire(
                        'Mensaje',
                        `Error guardar la compra`,
                        'error'
                      );
                    }
                  });
              });
          } else if (result.isDenied) {
            swal.fire('La compra no fue guardada', '', 'info');
          }
        }
        );
      } else {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Rellene los campos necesarios para continuar',
        })
      }
    }
  }

  descargarTicket() {
    var nombreArchivo = this.compra.ticket;
    console.log(nombreArchivo);
    window.open("http://localhost:8080/api/compras/show/archivo/" + nombreArchivo);
  }

  crearActualizarInventario()
  {
      this.detalleCompraService.getDetallesCompra(this.compra.id_compra).subscribe(
        detasss => {
          console.log(detasss[0]);
        }
      )
  }

}
