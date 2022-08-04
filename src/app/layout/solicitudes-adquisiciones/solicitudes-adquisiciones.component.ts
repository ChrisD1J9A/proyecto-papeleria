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
  displayedColumns: string[] = ['id_solicitud',  'fecha_solicitud', 'fecha_revision', 'nombre_usuario', 'estatus', 'action'];
  dataSource1 = new MatTableDataSource();//Tabla de solicitudes aceptadas
  dataSource2 = new MatTableDataSource();//Tabla de solicitudes rechazadas
  dataSource3 = new MatTableDataSource();//Tabla de solicitudes pendientes
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema
  solicitudesPendientes: number; //Para almacenar la cantidad de solicitudes Pendientes

  constructor(private solicitudService: SolicitudesService) { }

  ngOnInit(): void {
    this.error = false;
      //Se buscan las solicitudes de estatus aceptada
      this.solicitudService.getSolicitudesByEstatus("Aceptada").subscribe(
        solicitudesA => {
          this.dataSource1 = new MatTableDataSource(solicitudesA);
        },(err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
        });
        //Se buscan las solicitudes de estatus rechazada
        this.solicitudService.getSolicitudesByEstatus("Rechazada").subscribe(
          solicitudesR => {
            this.dataSource2 = new MatTableDataSource(solicitudesR);
          },(err) => {
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
          });
      //Se buscan las solicitudes de estatus pendiente
      this.solicitudService.getSolicitudesByEstatus("Pendiente").subscribe(
        solicitudesP => {
          this.dataSource3 = new MatTableDataSource(solicitudesP);
          this.solicitudesPendientes = solicitudesP.length;
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
}
