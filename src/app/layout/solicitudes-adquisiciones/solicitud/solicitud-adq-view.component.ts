import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../solicitudes/solicitud';
import { Detalle_solicitud } from '../../solicitudes/detalle_solicitud';
import { SolicitudesService } from '../../solicitudes/solicitudes.service';
import { DetalleSolicitudService } from '../../solicitudes/detalle-solicitud.service';
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
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];
  dataSource = new MatTableDataSource();
  flag: boolean;
  observacion_aprobacion_rechazo = new FormControl('', [Validators.required]);
  cant_autorizada = new FormControl('', [Validators.required]);


  constructor(private solicitudesService: SolicitudesService,
    private detalleSolicitudService: DetalleSolicitudService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

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
          })
        this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
          deta_solicitudes => {
            this.dataSource = new MatTableDataSource(deta_solicitudes);
            console.log(id);
            console.log(this.dataSource.data);
          });
      }
    })
  }

  validarDetalles():boolean
  {
      this.detalles_solicitud = this.dataSource.data;
      let bandera =  false;
      for(this.detalle_solicitud of this.detalles_solicitud)
      {
        if(this.detalle_solicitud.cant_autorizada == 0)
        {
          bandera = true;
        }
      }
      return bandera;
  }

  guardarSolicitud(): void {
    console.log(this.validarDetalles());
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
          this.solicitud.id_usuario_aprob = 1;
          this.solicitudesService.update(this.solicitud).subscribe(
            solicitud => {
              this.detalleSolicitudService.update(this.detalles_solicitud, solicitud.id_solicitud).subscribe(
                detalles => {
                  if (detalles) {
                    swal.fire(
                      'Mensaje',
                      `La solicitud:  ${solicitud.id_solicitud} fue aprobada con éxito`,
                      'success'
                    );
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
      swal.fire('Rellene todos los campos requeridos', '', 'info')
    }
  }

  rechazarSolicitud(): void {

    if (this.solicitud.observacion_aprobacion_rechazo) {
      this.solicitud.estatus = "Rechazada";
      this.solicitud.fecha_aprobacion = new Date();
      this.solicitud.id_usuario_aprob = 1;

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

}
