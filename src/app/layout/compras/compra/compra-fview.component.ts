import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { Proveedor } from '../../../administracion/modelos/papeleria/proveedor';
import { Inventario } from '../../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../../administracion/modelos/papeleria/detalle_inventario';
import { ProveedoresService } from '../../../administracion/servicios/papeleria/proveedores.service';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { InventarioService } from '../../../administracion/servicios/papeleria/inventario.service';
import { Detalle_compra_PFDC } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { DetalleInventarioService } from '../../../administracion/servicios/papeleria/detalle-inventario.service'
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { TicketViewComponent } from '../../compras-adquisiciones/compra/ticket/ticket-view.component';
import { MatDialog } from '@angular/material/dialog';


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
  detalle_compra_PFDC = new Detalle_compra_PFDC();
  detalles_compra_PFDC = new Array();
  proveedor = new Proveedor();
  proveedores: Proveedor[];
  inventario: Inventario;
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  nombreProveedor: String;
  banderaEditar: Boolean;
  private ticket: File;
  fecha_compra = new FormControl('', [Validators.required]);
  numericos = new FormControl('', [Validators.required]);
  mensajet = "Ticket no seleccionado";
  today = new Date();
  minDate: Date;
  bandera = true;
  pfdcFlag: boolean;
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock
  maxExistencia: number;  //configuracion de maximo de existencia
  minExistencia: number; //configuracion de minimo de existencia
  numeroSolicitud: number;//Variable para almacenar el id de la solicitud al que pertenece la compra
  precioFormateado: string; //variable que se usa para dar formato de pesos en el input gasto total

  constructor(private comprasService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private proveedoresService: ProveedoresService,
    private inventarioService: InventarioService,
    private detaInventarioService: DetalleInventarioService,
    private detalleCompraPFDCService: DetalleCompraPFDCService,
    private maxMinStockService: MaxMinStockService,
    private maxMinExistenciaService: MaxMinExistenciaService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 12, 31);
  }

  ngOnInit(): void {
    this.cargarCompra();
    this.proveedoresService.getProveedores().subscribe(
      proveedores => {
        this.proveedores = proveedores;
      });
    this.obtenerMaximosMinimosDeLaSucursal();
  }

  getErrorMessage() {
    return this.fecha_compra.hasError('required') ? 'Seleccione una fecha' : '';
  }

  getErrorMessage2() {
    return 'Ingrese una cantidad válida';
  }

  //En este método se da formato de  pesos al input que registra precios, en este caso del gasto gasto_total
  formatoDePesos(element) {
    if (isNaN(this.compra.gasto_total)) {
      swal.fire('No es una cantidad válida', 'Ingrese una cantidad válida', 'error');
      this.compra.gasto_total = 0.0;
    } else {
      this.precioFormateado = this.compra.gasto_total.toString();
      this.precioFormateado = this.currencyPipe.transform(this.precioFormateado, '$');
      element.target.value = this.precioFormateado;
    }
  }

  total_input(n: any) {
    if (n % 1 == 0) {
      this.bandera = true;
      console.log(n);
      console.log(this.bandera);
    } else {
      this.bandera = false;
      console.log(n);
      console.log(this.bandera);
    }
  }

  cargarCompra(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.comprasService.getCompra(id).subscribe(
          (compra) => {
            this.compra = compra;
            this.proveedor = this.compra.proveedor;
            this.numeroSolicitud = compra.solicitud.id_solicitud;
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

            if (compra.solicitud.pfdc) {
              this.detalleCompraPFDCService.getDetallesCompra_PFDC(compra.id_compra).subscribe(
                detalles_ComprasPFDC => {
                  console.log(detalles_ComprasPFDC);
                  this.dataSource2 = new MatTableDataSource(detalles_ComprasPFDC);
                  this.detalles_compra = detalles_ComprasPFDC;
                  this.pfdcFlag = true;
                });
            } else {
              this.pfdcFlag = false;
            }
          });
        this.detalleCompraService.getDetallesCompra(id).subscribe(
          deta_compra => {
            this.dataSource = new MatTableDataSource(deta_compra);
            this.detalles_compra = deta_compra;
          });
      }
    });
  }

  subirTicket(event) {
    this.ticket = event.target.files[0];
    if (this.ticket.type.indexOf('pdf') < 0 && this.ticket.type.indexOf('image') < 0) {
      swal.fire('Error seleccionar un formato válido: ', 'El archivo debe ser del tipo imagen o pdf', 'error');
      this.ticket = null;
    }
    if (this.ticket) {
      this.mensajet = this.ticket.name;
    } else {
      this.mensajet = "Ticket no seleccionado*";
    }
  }

  validarDetalles(): boolean {
    let bandera = false;
    this.detalles_compra = this.dataSource.data;
    this.detalles_compra_PFDC = this.dataSource2.data;
    for (this.detalle_compra of this.detalles_compra) {
      if (this.detalle_compra.cant_comprada == null || this.detalle_compra.cant_comprada < 1 || this.detalle_compra.cant_comprada > this.maxStock) {
        bandera = true;
      }
    }

    for (this.detalle_compra_PFDC of this.detalles_compra_PFDC) {
      if (this.detalle_compra_PFDC.cant_comprada == null || this.detalle_compra_PFDC.cant_comprada < 1 || this.detalle_compra_PFDC.cant_comprada > this.maxStock) {
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
            this.compra.usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);
            //this.detalles_compra = this.dataSource.data;
            this.comprasService.update(this.compra).subscribe(
              compra => {
                this.comprasService.cargarTicket(this.ticket, compra.id_compra).
                  subscribe(compra => {
                    console.log(compra);
                    if (compra.solicitud.pfdc === true) {
                      this.detalles_compra_PFDC = this.dataSource2.data;
                      this.detalleCompraPFDCService.update(this.detalles_compra_PFDC, compra.id_compra).subscribe(detas_pfdc => { });
                    }
                  });
                this.detalleCompraService.update(this.detalles_compra, compra.id_compra).subscribe(
                  detalles => {
                    if (detalles) {
                      this.crearActualizarInventario(detalles);
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

  crearActualizarInventario(detalles_c: Detalle_compra[]) {
    var deta_compra = new Detalle_compra()
    this.inventarioService.getInventarioBySucursal(this.compra.id_sucursal).subscribe(
      inventarioConsulta => {
        if (inventarioConsulta === null) {
          console.log("No hay inventario");

          var deta_invent = new Detalle_inventario();
          var invent = new Inventario();
          invent.nombre_sucursal = this.compra.nombre_sucursal;
          invent.id_sucursal = this.compra.id_sucursal;
          invent.fecha_ultima_actualizacion = new Date();
          this.inventarioService.create(invent).subscribe(
            inventarionuevo => {
              for (deta_compra of detalles_c) {
                deta_invent.inventario = inventarionuevo;
                deta_invent.producto = deta_compra.producto;
                deta_invent.cant_existente = deta_compra.cant_existente + deta_compra.cant_comprada;
                deta_invent.fecha_ultima_actualizacion = new Date();
                this.detaInventarioService.create(deta_invent).subscribe(
                  deta_i => {
                    console.log("done " + deta_i.producto.descripcion + " " + deta_i.inventario.id_inventario);
                  })
              }
            });
        } else {
          console.log("Si hay inventario");
          inventarioConsulta.fecha_ultima_actualizacion = new Date();
          this.inventarioService.update(inventarioConsulta).subscribe(
            inventarioActualizado => {
              var deta_i = new Detalle_inventario();
              deta_i.inventario = inventarioActualizado;
              for (deta_compra of detalles_c) {
                deta_i.producto = deta_compra.producto;
                deta_i.fecha_ultima_actualizacion = new Date();
                deta_i.cant_existente = deta_compra.cant_existente + deta_compra.cant_comprada;
                this.detaInventarioService.create(deta_i).subscribe(
                  det => {
                    console.log("actualizado/creado");
                  });
              }
            });
        }
      });
  }

  openDialog() {
    var ubicacionArchivo = "http://localhost:8080/api/compras/show/archivo/" + this.compra.ticket;
    this.dialog.open(TicketViewComponent, {
      width: "1000px",
      data: {
        ticket: ubicacionArchivo,
      },
    });
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
  donde se esta logeando y se almacenan dichas configuraciones en variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal() {
    var nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!);
    this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(
      maxMinStockSucursal => {
        if (maxMinStockSucursal === null) {
          this.maxStock = 50;
          this.minStock = 5;
        } else {
          this.maxStock = maxMinStockSucursal.max_stock;
          this.minStock = maxMinStockSucursal.min_stock;
        }
      });

    this.maxMinExistenciaService.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(
      maxMinExistenciaSucursal => {
        if (maxMinExistenciaSucursal === null) {
          this.maxExistencia = 50;
          this.minExistencia = 5;
        } else {
          this.maxExistencia = maxMinExistenciaSucursal.max_existencia;
          this.minExistencia = maxMinExistenciaSucursal.min_existencia;
        }
      });
  }
}
