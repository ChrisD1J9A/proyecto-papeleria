import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../solicitud';
import { Detalle_solicitud } from '../detalle_solicitud';
import {SolicitudesService} from '../solicitudes.service';
import { DetalleSolicitudService } from '../detalle-solicitud.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitud-fview',
  templateUrl: './solicitud-fview.component.html',
  styleUrls: ['./solicitud-fview.component.scss']
})
export class SolicitudFViewComponent implements OnInit {
    solicitud= new Solicitud();
    detalle_solicitud = new Detalle_solicitud();
    detalles_solicitud: Detalle_solicitud[];
    displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];
    dataSource = new MatTableDataSource();

  constructor(private solicitudesService: SolicitudesService, private detalleSolicitudService: DetalleSolicitudService, private router: Router, private activatedRoute: ActivatedRoute) { }

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
          (solicitud) => this.solicitud = solicitud
        )
        this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
          deta_solicitudes => {
            this.dataSource = new MatTableDataSource(deta_solicitudes);
          });
      }
    })
  }

}
