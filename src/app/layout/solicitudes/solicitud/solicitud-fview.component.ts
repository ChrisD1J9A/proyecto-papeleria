import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { SolicitudesService } from '../../../administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud_pfdc } from '../../../administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { DetalleSolicitudPFDCService } from '../../../administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitud-fview',
  templateUrl: './solicitud-fview.component.html',
  styleUrls: ['./solicitud-fview.component.scss']
})
export class SolicitudFViewComponent implements OnInit {
  solicitud = new Solicitud(); //Objecto solicitud
  detalle_solicitud = new Detalle_solicitud();//Objeto detalle solicitud
  detalles_solicitud: Detalle_solicitud[];//Arreglo de detalles de solicitud
  detalle_solicitud_PFDC = new Detalle_solicitud_pfdc();//Objeto de detalle solicitud con productos fuera del catalogo
  detalles_solicitud_PFDC: Detalle_solicitud_pfdc[];//Arreglo de de detalles de solicitud con productos fuera del catalogo
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];//Encabezados para las columnas de la tabla de detalles
  dataSource = new MatTableDataSource();//Tabla para detales de solicitud
  dataSource2 = new MatTableDataSource();//Tabla para detales de solicitud con productos fuera del catalogo
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private solicitudesService: SolicitudesService,
    private detalleSolicitudService: DetalleSolicitudService,
    private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.banderaCarga = false;
    this.error = false;
    this.cargarSolicitud();//Metodo mediante el cual se carga la solicitud
  }

  //Metodo que carga la solicitud desde la base de datos
  cargarSolicitud(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']//Se obtiene el id de la solicitud en la ruta de navegacion
      if (id) {//Se valida que exista el id
        //Se busca la solicitud mediante el id_solicitud
        this.solicitudesService.getSolicitud(id).subscribe(
          (response) => {
            if (response.solicitud) {
              this.solicitud = response.solicitud
              this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
                deta_solicitudes => {//Se buscan los detalles de la solicitud acorde al id_solicitud
                  this.dataSource = new MatTableDataSource(deta_solicitudes);//Se carga a la tabla
                });
              this.detalleSolicitudPFDCService.getDetallesSolicitud_pfdc(id).subscribe(
                detalles_solicitudesPFDC => {//Se obtienen los detalles de solicitud con productos fuera del catalogo
                  this.dataSource2 = new MatTableDataSource(detalles_solicitudesPFDC);//Se carga a la tabla de productos fuera del catalogo
                });
            }
          },
          (err) => {
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
            //Mensaje relacionado con el error
            swal.fire('Error',`Error al cargar la solicitud`,'error');
          });
      }
    });
  }

  //Metodo para cancelar una solicitud, para cambiar el estatus de la solicitud siempre y cuando la solicitud se encuentre en pendiente
  cancelarSolicitud() {
    //Se inicializa el spinner
    this.banderaCarga = true;
    swal.fire({
      title: '¿Está seguro de cancelar esta solicitud? ',//Se pregunta al usuario antes de proseguir
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No, seguir viendo`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitud.estatus = "Cancelada";//Se cambia el estatus
        this.solicitud.fecha_cancelacion = new Date();//Se establece la fecha de cancelacion
        this.solicitudesService.update(this.solicitud).subscribe(
          solicitud => {//Se actualiza la solicitud
            //Se detiene el spinner
            this.banderaCarga = false;
            swal.fire(`La solicitud:  ${solicitud.id_solicitud} fue cancelada con éxito`, '', 'success');//Se manda mensaje de operacion exitosa
            this.router.navigate(['/layout/solicitudes']);//Se redirige a la tabla de las solicitudes
          },
          (err) => {
            //Se detiene el spinner
            this.banderaCarga = false;
            //Mensaje de error en caso de no almacenarse la solicitud
            swal.fire(err,`Error al envíar la solicitud`,'error');
          });
      } else if (result.isDenied) {
        //Se detiene el spinner
        this.banderaCarga = false;
        swal.fire('La solicitud no fue guardada', '', 'info'); //De no continuar el usuario aparece este mensaje
      }
    });

  }
}
