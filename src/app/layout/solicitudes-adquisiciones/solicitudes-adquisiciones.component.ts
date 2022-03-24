import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../administracion/modelos/papeleria/solicitud';
import { SolicitudesService } from '../../administracion/servicios/papeleria/solicitudes.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitudes-adquisiciones',
  templateUrl: './solicitudes-adquisiciones.component.html',
  styleUrls: ['./solicitudes-adquisiciones.component.scss']
})
export class SolicitudesAdquisicionesComponent implements OnInit {
  solicitud = new Solicitud();
  solicitudes: Solicitud[];
  aceptadas: Solicitud[];
  rechazadas: Solicitud[];
  pendientes: Solicitud[];
  displayedColumns: string[] = ['id_solicitud',  'fecha_solicitud', 'nombre_usuario', 'estatus', 'action'];
  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();;

  constructor(private solicitudService: SolicitudesService) { }

  ngOnInit(): void {
    this.solicitudService.getSolicitudes().subscribe(
      solicitudes => {
        this.solicitudes = solicitudes
        this.aceptadas = this.filtrarAceptadas(solicitudes);
        this.rechazadas = this.filtrarRechazadas(solicitudes);
        this.pendientes = this.filtrarPendientes(solicitudes);
        this.dataSource1 = new MatTableDataSource(this.aceptadas);
        this.dataSource2 = new MatTableDataSource(this.rechazadas);
        this.dataSource3 = new MatTableDataSource(this.pendientes);
      });
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  filtrarAceptadas(solicitudes: Solicitud[]): Solicitud[] {
    const aceptadas = solicitudes.filter(solicitud => solicitud.estatus === "Aceptada");
    return aceptadas;
  }

  filtrarRechazadas(solicitudes: Solicitud[]): Solicitud[] {
    const rechazadas = solicitudes.filter(solicitud => solicitud.estatus === "Rechazada");
    return rechazadas;
  }

  filtrarPendientes(solicitudes: Solicitud[]): Solicitud[] {
    const pendientes = solicitudes.filter(solicitud => solicitud.estatus === "Pendiente");
    return pendientes;
  }

}
