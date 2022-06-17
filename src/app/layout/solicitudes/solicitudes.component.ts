import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../administracion/modelos/papeleria/solicitud';
import { SolicitudesService } from '../../administracion/servicios/papeleria/solicitudes.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
})

export class SolicitudesComponent implements OnInit {
  solicitud = new Solicitud();//Objeto solicitud
  solicitudes: Solicitud[];//Arreglo de solicitudes
  aceptadas: Solicitud[];//Arreglo para almacenar solicitudes aceptadas
  rechazadas: Solicitud[];//Arreglo para almacenar solicitudes rechazadas
  pendientes: Solicitud[];//Arreglo para almacenar solicitudes pendientes
  canceladas: Solicitud[];//Arreglo para almacenar solicitudes canceladas
  displayedColumns: string[] = ['id_solicitud', 'fecha_solicitud', 'fecha_revision', 'estatus', 'action'];//Encabezados de las columnas de las solicitudes
  dataSource1 = new MatTableDataSource();//tabla de solicitudes aceptadas
  dataSource2 = new MatTableDataSource();//tabla de solicitudes rechazadas
  dataSource3 = new MatTableDataSource();//tabla de solicitudes pendientes
  dataSource4 = new MatTableDataSource();//tabla de solicitudes canceladas
  idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);//Se obtiene el id de la sucursal donde se incio sesion
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private solicitudService: SolicitudesService) { }

  ngOnInit(): void {
    this.error = false;
    this.solicitudService.getSolicitudesBySucursal(this.idSucursal).subscribe(
      solicitudes => {//Se obtienen las solicitudes de la sucursal donde se logeo
        this.solicitudes = solicitudes;
        this.aceptadas = this.filtrarAceptadas(solicitudes);
        this.rechazadas = this.filtrarRechazadas(solicitudes);
        this.pendientes = this.filtrarPendientes(solicitudes);
        this.canceladas = this.filtrarCanceladas(solicitudes);
        this.dataSource1 = new MatTableDataSource(this.aceptadas);
        this.dataSource2 = new MatTableDataSource(this.rechazadas);
        this.dataSource3 = new MatTableDataSource(this.pendientes);
        this.dataSource4 = new MatTableDataSource(this.canceladas);
      },(err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
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

  //Metodo para realizar busquedas en la tabla de solicitudes canceladas
  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
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

  //Metodo para realizar filtrar la lista principal a solo canceladas
  filtrarCanceladas(solicitudes: Solicitud[]): Solicitud[] {
    const pendientes = solicitudes.filter(solicitud => solicitud.estatus === "Cancelada");
    return pendientes;
  }
}
