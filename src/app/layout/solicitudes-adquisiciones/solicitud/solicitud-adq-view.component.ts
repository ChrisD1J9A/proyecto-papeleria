import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../solicitudes/solicitud';
import { Detalle_solicitud } from '../../solicitudes/detalle_solicitud';
import { SolicitudesService } from '../../solicitudes/solicitudes.service';
import { DetalleSolicitudService } from '../../solicitudes/detalle-solicitud.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitud-adq-view',
  templateUrl: './solicitud-adq-view.component.html',
  styleUrls: ['./solicitud-adq-view.component.scss']
})
export class SolicitudAdqViewComponent implements OnInit {
  solicitud = new Solicitud();
  detalle_solicitud = new Detalle_solicitud();
  detalles_solicitud=  new Array();
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];
  dataSource = new MatTableDataSource();


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
            console.log(this.dataSource.data);
          });
      }
    })
  }

  guardarSolicitud(): void {
    this.detalles_solicitud = this.dataSource.data;
    this.solicitud.estatus = "Aceptada";
    this.solicitud.fecha_aprobacion = new Date().toString();
    this.solicitud.id_usuario_aprob = 1;
    console.log(this.solicitud);
    swal.fire({
      title: '¿Está seguro de aprobar esta solicitud? ',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `Seguir`,
    }).then((result) => {
      /*if (result.isConfirmed) {
        this.solicitudesService.update(this.solicitud).subscribe(
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
      }*/
    })
  }

}
