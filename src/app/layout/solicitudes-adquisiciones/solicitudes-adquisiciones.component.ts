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
  solicitud = new Solicitud();//Objeto solicitud
  solicitudes: Solicitud[];//Arreglo de solicitudes
  aceptadas: Solicitud[];//Arreglo de solicitudes aceptadas
  rechazadas: Solicitud[];//Arreglo de solicitudes rechazadas
  pendientes: Solicitud[];//Arreglo de solicitudes pendientes
  displayedColumns: string[] = ['id_solicitud',  'fecha_solicitud', 'fecha_revision', 'nombre_usuario', 'estatus', 'action'];
  dataSource1 = new MatTableDataSource();//Tabla de solicitudes aceptadas
  dataSource2 = new MatTableDataSource();//Tabla de solicitudes rechazadas
  dataSource3 = new MatTableDataSource();//Tabla de solicitudes pendientes

  constructor(private solicitudService: SolicitudesService) { }

  ngOnInit(): void {
    this.solicitudService.getSolicitudes().subscribe(
      solicitudes => {//Se obtienen las solicitudes de la base de datos y se realizan filtros para cada tipo de solicitud
        this.solicitudes = solicitudes
        this.aceptadas = this.filtrarAceptadas(solicitudes);
        this.rechazadas = this.filtrarRechazadas(solicitudes);
        this.pendientes = this.filtrarPendientes(solicitudes);
        this.dataSource1 = new MatTableDataSource(this.aceptadas);
        this.dataSource2 = new MatTableDataSource(this.rechazadas);
        this.dataSource3 = new MatTableDataSource(this.pendientes);
      });
  }

  //Metodo para realizar busquedas en la tabla de solicitudes aceptadas
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  //Metodo para realizar busquedas en la tabla de solicitudes rechazadas
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  //Metodo para realizar busquedas en la tabla de solicitudes pendientes
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  //Metodo para realizar filtrar la lista principal a solo aceptadas
  filtrarAceptadas(solicitudes: Solicitud[]): Solicitud[] {
    const aceptadas = solicitudes.filter(solicitud => solicitud.estatus === "Aceptada");
    return aceptadas;
  }

  //Metodo para realizar filtrar la lista principal a solo rechazadas
  filtrarRechazadas(solicitudes: Solicitud[]): Solicitud[] {
    const rechazadas = solicitudes.filter(solicitud => solicitud.estatus === "Rechazada");
    return rechazadas;
  }

  //Metodo para realizar filtrar la lista principal a solo pendientes
  filtrarPendientes(solicitudes: Solicitud[]): Solicitud[] {
    const pendientes = solicitudes.filter(solicitud => solicitud.estatus === "Pendiente");
    return pendientes;
  }

}
