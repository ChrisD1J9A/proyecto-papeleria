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
      //Se buscan las solicitudes de la sucursal y de estatus aceptada
      this.solicitudService.getSolicitudesBySucursalAndEstatus(this.idSucursal, "Aceptada").subscribe(
        solicitudesA => {
          this.dataSource1 = new MatTableDataSource(solicitudesA);
        },(err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
        });
        //Se buscan las solicitudes de la sucursal y de estatus rechazada
        this.solicitudService.getSolicitudesBySucursalAndEstatus(this.idSucursal, "Rechazada").subscribe(
          solicitudesR => {
            this.dataSource2 = new MatTableDataSource(solicitudesR);
          },(err) => {
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
          });
      //Se buscan las solicitudes de la sucursal y de estatus pendiente
      this.solicitudService.getSolicitudesBySucursalAndEstatus(this.idSucursal, "Pendiente").subscribe(
        solicitudesP => {
          this.dataSource3 = new MatTableDataSource(solicitudesP);
        },(err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
        });
      //Se buscan las solicitudes de la sucursal y de estatus cancelada
      this.solicitudService.getSolicitudesBySucursalAndEstatus(this.idSucursal, "Cancelada").subscribe(
        solicitudesC => {
          this.dataSource4 = new MatTableDataSource(solicitudesC);
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
}
