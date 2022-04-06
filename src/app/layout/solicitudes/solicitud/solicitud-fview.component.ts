import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { SolicitudesService } from '../../../administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud_PFDC } from '../../../administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { DetalleSolicitudPFDCService } from '../../../administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitud-fview',
  templateUrl: './solicitud-fview.component.html',
  styleUrls: ['./solicitud-fview.component.scss']
})
export class SolicitudFViewComponent implements OnInit {
  solicitud = new Solicitud();
  detalle_solicitud = new Detalle_solicitud();
  detalles_solicitud: Detalle_solicitud[];
  detalle_solicitud_PFDC = new Detalle_solicitud_PFDC();
  detalles_solicitud_PFDC: Detalle_solicitud_PFDC[];
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();

  constructor(private solicitudesService: SolicitudesService,
              private detalleSolicitudService: DetalleSolicitudService,
              private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
              private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarSolicitud();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  cargarSolicitud(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.solicitudesService.getSolicitud(id).subscribe(
          (solicitud) =>
          this.solicitud = solicitud
        )
        this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
          deta_solicitudes => {
            this.dataSource = new MatTableDataSource(deta_solicitudes);
            console.log(id);
          });
        this.detalleSolicitudPFDCService.getDetallesSolicitud_PFDC(id).subscribe(
          detalles_solicitudesPFDC => {
            this.dataSource2 = new MatTableDataSource(detalles_solicitudesPFDC);
          });
      }
    });
  }

  cancelarSolicitud()
  {
    swal.fire({
      title: '¿Está seguro de cancelar esta solicitud? ',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No, seguir viendo`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitud.estatus = "Cancelada";
        this.solicitud.fecha_cancelacion = new Date();
      //  this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);;
        this.solicitudesService.update(this.solicitud).subscribe(
          solicitud => {
            swal.fire(`La solicitud:  ${solicitud.id_solicitud} fue cancelada con éxito`, '', 'success');
            this.router.navigate(['/layout/solicitudes'])
          })
      } else if (result.isDenied) {
        swal.fire('La solicitud no fue guardada', '', 'info');
      }
    })

  }

}
