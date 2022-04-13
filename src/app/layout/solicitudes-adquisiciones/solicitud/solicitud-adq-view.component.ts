import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { SolicitudesService } from '../../../administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud_PFDC } from '../../../administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { DetalleSolicitudPFDCService } from '../../../administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { Detalle_compra_PFDC } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-adq-view',
  templateUrl: './solicitud-adq-view.component.html',
  styleUrls: ['./solicitud-adq-view.component.scss']
})
export class SolicitudAdqViewComponent implements OnInit {
  solicitud = new Solicitud();
  detalle_solicitud = new Detalle_solicitud();
  detalles_solicitud = new Array();
  detalles_solicitud_pfdc = new Array();
  detalle_solicitud_PFDC = new Detalle_solicitud_PFDC();
  detalle_compra_pfdc = new Detalle_compra_PFDC();
  compra = new Compra();
  detalle_compra = new Detalle_compra();
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];
  dataSource = new MatTableDataSource();
  flag: boolean;
  observacion_aprobacion_rechazo = new FormControl('', [Validators.required]);
  cant_autorizada = new FormControl('', [Validators.required]);
  nombre_usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);
  dataSource2 = new MatTableDataSource();

  constructor(private solicitudesService: SolicitudesService,
              private detalleSolicitudService: DetalleSolicitudService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private comprasService: ComprasService,
              private detalleCompraService: DetalleCompraService,
              private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
              private detalleCompraPFDCService: DetalleCompraPFDCService) { }

  ngOnInit(): void {
    this.cargarSolicitud();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getErrorMessage() {
    return this.observacion_aprobacion_rechazo.hasError('required') ? 'Debe de dejar algún comentario' : '';
  }

  getErrorMessage2() {
    return this.cant_autorizada.hasError('required') ? 'Si la solicitud va a ser aceptada debe ingresar alguna cantidad' : '';
  }

  cargarSolicitud(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.solicitudesService.getSolicitud(id).subscribe(
          (solicitud) => {
            this.solicitud = solicitud;
            if (this.solicitud.estatus === "Pendiente") {
              this.flag = false;
            } else {
              this.flag = true;
            }
          });
        this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
          deta_solicitudes => {
            this.dataSource = new MatTableDataSource(deta_solicitudes);
            this.detalles_solicitud = deta_solicitudes;
          });
        this.detalleSolicitudPFDCService.getDetallesSolicitud_PFDC(id).subscribe(
            detalles_solicitudesPFDC => {
              this.dataSource2 = new MatTableDataSource(detalles_solicitudesPFDC);
              this.detalles_solicitud_pfdc = detalles_solicitudesPFDC;
        });
      }
    });
  }

  validarDetalles(): boolean {
    let bandera = false;
    for (this.detalle_solicitud of this.detalles_solicitud) {
      if (this.detalle_solicitud.cant_autorizada == null || this.detalle_solicitud.cant_autorizada < 1) {
        bandera = true;
      }
    }
    return bandera;
  }

  guardarSolicitud(): void {
    console.log(this.validarDetalles());
    if (this.validarDetalles()) {
      swal.fire('Para aceptar la solicitud debe de ingresar un valor diferente de cero o válido en la cantidad que autoriza', '', 'info');
    } else {
      if (this.solicitud.observacion_aprobacion_rechazo) {
        swal.fire({
          title: '¿Está seguro de aprobar esta solicitud? ',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No, seguir viendo`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.detalles_solicitud = this.dataSource.data;
            this.solicitud.estatus = "Aceptada";
            this.solicitud.fecha_aprobacion = new Date();
            this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);;
            this.solicitudesService.update(this.solicitud).subscribe(
              solicitud => {
                if(this.solicitud.pfdc===true){
                  this.detalles_solicitud_pfdc = this.dataSource2.data;
                  this.detalleSolicitudPFDCService.update(this.detalles_solicitud_pfdc, solicitud.id_solicitud).subscribe(detas_pfdc =>{});
                }

                this.detalleSolicitudService.update(this.detalles_solicitud, solicitud.id_solicitud).subscribe(
                  detalles => {
                    if (detalles) {
                      swal.fire(
                        'Mensaje',
                        `La solicitud:  ${solicitud.id_solicitud} fue aceptada con éxito`,
                        'success'
                      );
                      this.crearCompra()
                      this.router.navigate(['/layout/solicitudes-adquisiciones'])
                    } else {
                      swal.fire(
                        'Mensaje',
                        `Error al aceptar la solicitud`,
                        'error'
                      );
                    }
                  })
              })
          } else if (result.isDenied) {
            swal.fire('La solicitud no fue guardada', '', 'info');
          }
        })
      } else {
        swal.fire('Deje algún comentario para continuar', '', 'info')
      }
    }
  }

  rechazarSolicitud(): void {

    if (this.solicitud.observacion_aprobacion_rechazo) {
      this.solicitud.estatus = "Rechazada";
      this.solicitud.fecha_rechazo = new Date();
      this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);;

      swal.fire({
        title: '¿Está seguro de rechazar esta solicitud? ',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `Seguir`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.solicitudesService.update(this.solicitud).subscribe(
            solicitud => {
              console.log(solicitud);
              if (solicitud) {
                swal.fire(
                  'Mensaje',
                  `La solicitud:  ${solicitud.id_solicitud} fue rechazada con éxito`,
                  'success'
                );
                this.router.navigate(['/layout/solicitudes-adquisiciones'])
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al rechazar la solicitud`,
                  'error'
                );
              }
            })
        }
      })
    } else {
      swal.fire('Deje un comentario para continuar', '', 'info')
    }
  }


  crearCompra()
  {
    var detallesoli = new Detalle_solicitud();
    this.compra.solicitud = this.solicitud;
    this.compra.estatus = 'En proceso';
    this.compra.id_sucursal = this.solicitud.id_sucursal;
    this.compra.nombre_sucursal = this.solicitud.nombre_sucursal;
    this.comprasService.create(this.compra).subscribe(
      compra => {
        console.log(compra);
        for (detallesoli of this.detalles_solicitud){
          this.detalle_compra.compra = compra;
          this.detalle_compra.producto = detallesoli.producto;
          this.detalle_compra.cant_existente = detallesoli.cant_existente;
          this.detalle_compra.cant_solicitada = detallesoli.cant_solicitada;
          this.detalle_compra.cant_autorizada = detallesoli.cant_autorizada;
          this.detalleCompraService.create(this.detalle_compra).subscribe(
            detalles =>{
              console.log(detalles);
            });
        }
        if(this.solicitud.pfdc===true){
          var detaSoliPFDC = new Detalle_solicitud_PFDC();
          for(detaSoliPFDC of this.detalles_solicitud_pfdc){
            this.detalle_compra_pfdc.compra = compra;
            this.detalle_compra_pfdc.nombreProducto = detaSoliPFDC.nombreProducto;
            this.detalle_compra_pfdc.cant_existente = detaSoliPFDC.cant_existente;
            this.detalle_compra_pfdc.cant_solicitada = detaSoliPFDC.cant_solicitada;
            this.detalle_compra_pfdc.cant_autorizada = detaSoliPFDC.cant_autorizada;
            this.detalleCompraPFDCService.create(this.detalle_compra_pfdc).subscribe(
              detaCompraPFDC => {
                console.log(detaCompraPFDC);
              });
          }
        }
      });
  }
}
