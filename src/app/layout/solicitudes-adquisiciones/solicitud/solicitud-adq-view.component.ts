import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { SolicitudesService } from '../../../administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud_PFDC } from '../../../administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { DetalleSolicitudPFDCService } from '../../../administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { Detalle_compra_PFDC } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { Mail } from 'src/app/administracion/modelos/papeleria/Mail';
import { MailService } from 'src/app/administracion/servicios/papeleria/mail.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-adq-view',
  templateUrl: './solicitud-adq-view.component.html',
  styleUrls: ['./solicitud-adq-view.component.scss']
})
export class SolicitudAdqViewComponent implements OnInit {
  solicitud = new Solicitud();//Objeto solicitud
  detalle_solicitud = new Detalle_solicitud();//Objeto detalle solicitud
  detalles_solicitud = new Array();//Arreglo de detalles de solicitud
  detalles_solicitud_pfdc = new Array();//Arreglo de detalles de solicitud con productos fuera del catalogo
  detalle_solicitud_PFDC = new Detalle_solicitud_PFDC(); //detalle de solicitud con productos fuera del catalogo
  detalle_compra_pfdc = new Detalle_compra_PFDC(); //detalle de compra con productos fuera del catalogo
  compra = new Compra();//Objeto compra
  detalle_compra = new Detalle_compra();//Objeto de Detalle_compra
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];//Encabezados para las columnas de los detalles de solicitud
  dataSource = new MatTableDataSource();//Tabla de los detalles de solicitud
  flag: boolean;//bandera para activar o desacticr componentes
  observacion_aprobacion_rechazo = new FormControl('', [Validators.required]);//Form control para validar los comentrios del formulario
  cant_autorizada = new FormControl(); //FomrControl para evaluar la cantidad autorizada de productos del catalogo
  cant_autorizada2 = new FormControl();//FomrControl para evaluar la cantidad autorizada de productos fuera del catalogo
  nombre_usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);//Se obtiene el nombre del usuario logeado
  dataSource2 = new MatTableDataSource();
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock
  maxExistencia: number;  //configuracion de maximo de existencia
  minExistencia: number; //configuracion de minimo de existencia
  mail = new Mail(); //Objeto mail, usado para tener una estructura al momento de enviar un correo

  constructor(private solicitudesService: SolicitudesService,
              private detalleSolicitudService: DetalleSolicitudService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private comprasService: ComprasService,
              private detalleCompraService: DetalleCompraService,
              private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
              private detalleCompraPFDCService: DetalleCompraPFDCService,
              private maxMinStockService: MaxMinStockService,
              private maxMinExistenciaService: MaxMinExistenciaService,
              private mailService: MailService) { }

  ngOnInit(): void {
    this.cargarSolicitud();//Metodo mediante el cual se carga la solicitud
  }

  //Metodo que surge para indicar al usuario de que deje un comentario para aceptar o rechazar una solicitud
  getErrorMessage() {
    return this.observacion_aprobacion_rechazo.hasError('required') ? 'Deje algún comentario' : '';
  }

  //Metodo para mostrar el mensaje de cantidad no válida
  getErrorMessage2(){
      return 'Cantidad ingresada no válida';
  }

  //Metodo donde se carga la solicitud
  cargarSolicitud(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']//Se guarda el id_solicitud que viene en la ruta de navegacion
      if (id) {
        this.solicitudesService.getSolicitud(id).subscribe(
          (solicitud) => {//SE BUSCA LA Solicitud mediante el id
            this.solicitud = solicitud;//se guarda la solicitud
            this.obtenerMaximosMinimosDeLaSucursal(solicitud);//se cargan las configuraciones de la sucursal donde se emite la solicitud
            if (this.solicitud.estatus === "Pendiente") {//Si el estus es pendiente
              this.flag = false;//Entonces se muestran componentes para una solicitud pendiente
            } else {
              this.flag = true;//Entonces se muestran componentes para una solicitud que no es pendiente(Rechazada o aceptada)
            }
          });
        this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
          deta_solicitudes => {//Se obtienen los detalles de la solicitud mediate el id
            this.dataSource = new MatTableDataSource(deta_solicitudes);//Se cargan los datos a la tabla
            this.detalles_solicitud = deta_solicitudes; //Se guardan los datos en su lista
          });
        this.detalleSolicitudPFDCService.getDetallesSolicitud_PFDC(id).subscribe(
            detalles_solicitudesPFDC => {//Se obtienen los detalles de la solicitud con productos fuera del catalogo mediate el id
              this.dataSource2 = new MatTableDataSource(detalles_solicitudesPFDC); //Se cargan los datos a su tabla
              this.detalles_solicitud_pfdc = detalles_solicitudesPFDC;//Se guardan los datos en su lista
        });
      }
    });
  }

  //Para el caso en el que el estatus de que la solicitud sea pendiente, y se regitre acepte la solicitud en este método se validan los input donde se especifica cuanta cantidad de X producto se autoriza
  validarDetalles(): boolean {
    let bandera = false;//Bandera que devolera este metodo, de ser true quiere decir que hay error en el fomulario, de lo contrario no hay error
    for (this.detalle_solicitud of this.detalles_solicitud) {//Se recorren inicialmente los productos dentro del catalogo
      if (this.detalle_solicitud.cant_autorizada == null || this.detalle_solicitud.cant_autorizada < 1 || this.detalle_solicitud.cant_autorizada > this.maxStock) {//La cantidad autorizada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
        bandera = true;
      }
    }

    for (this.detalle_solicitud_PFDC of this.detalles_solicitud_pfdc) {//Se recorren los productos fuera del catalogo
      if (this.detalle_solicitud_PFDC.cant_autorizada == null || this.detalle_solicitud_PFDC.cant_autorizada < 1 || this.detalle_solicitud_PFDC.cant_autorizada > this.maxStock) {//La cantidad autorizada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
        bandera = true;
      }
    }
    return bandera;
  }

  //Metodo para guardar/Actualizar la solicitud
  guardarSolicitud(): void {
    if (this.validarDetalles()) {//Se valida los input donde se ingresó la cantidad autorizada
      swal.fire('Para aceptar la solicitud debe de ingresar un valor diferente de cero o válido en la cantidad que autoriza', '', 'info');
    } else {
      if (this.solicitud.observacion_aprobacion_rechazo) {//Se evalua que el campo requiro sea diferente de nulo
        swal.fire({
          title: '¿Está seguro de aprobar esta solicitud? ',//Se pide verificacion
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No, seguir viendo`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.detalles_solicitud = this.dataSource.data;//Se obtienen los datos actualizados
            this.solicitud.estatus = "Aceptada";//El estatus cambia
            this.solicitud.fecha_aprobacion = new Date();//Se actualiza la fecha de fecha_aprobacion
            this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);;//Se obtiene el nombre del usuario logeado
            this.solicitudesService.update(this.solicitud).subscribe(
              solicitud => {//SE ACTUALIZA LA Solicitud
                if(this.solicitud.pfdc===true){//Si hubieron productos fuera del catalogo
                  this.detalles_solicitud_pfdc = this.dataSource2.data;//Se obtienen los datos y se actualizan en la base de datos
                  this.detalleSolicitudPFDCService.update(this.detalles_solicitud_pfdc, solicitud.id_solicitud).subscribe(detas_pfdc =>{});
                }

                this.detalleSolicitudService.update(this.detalles_solicitud, solicitud.id_solicitud).subscribe(
                  detalles => {//Se obtienen los datos y se actualizan en la base de datos
                    if (detalles) {
                      swal.fire(
                        'Mensaje',
                        `La solicitud:  ${solicitud.id_solicitud} fue aceptada con éxito`,
                        'success'
                      );
                      this.crearCompra();//Se crea una compra para la solicitud actual
                      this.enviarCorreo(solicitud);//Se manda un correo notificando el estatus de la sol}
                      this.router.navigate(['/layout/solicitudes-adquisiciones']);//Se redirecciona  a las solicitudes
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
        swal.fire('Deje algún comentario para continuar', '', 'info')
      }
    }
  }

  rechazarSolicitud(): void {
    if (this.solicitud.observacion_aprobacion_rechazo) {
      this.solicitud.estatus = "Rechazada";
      this.solicitud.fecha_rechazo = new Date();
      this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);;

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
                this.enviarCorreo(solicitud)
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


  crearCompra()
  {
    var detallesoli = new Detalle_solicitud();
    this.compra.solicitud = this.solicitud;
    this.compra.estatus = 'En proceso';
    this.compra.id_sucursal = this.solicitud.id_sucursal;
    this.compra.nombre_sucursal = this.solicitud.nombre_sucursal;
    this.comprasService.create(this.compra).subscribe(
      compra => {
        console.log(compra);
        for (detallesoli of this.detalles_solicitud){
          this.detalle_compra.compra = compra;
          this.detalle_compra.producto = detallesoli.producto;
          this.detalle_compra.cant_existente = detallesoli.cant_existente;
          this.detalle_compra.cant_solicitada = detallesoli.cant_solicitada;
          this.detalle_compra.cant_autorizada = detallesoli.cant_autorizada;
          this.detalleCompraService.create(this.detalle_compra).subscribe(
            detalles =>{
              console.log(detalles);
            });
        }
        if(this.solicitud.pfdc===true){
          var detaSoliPFDC = new Detalle_solicitud_PFDC();
          for(detaSoliPFDC of this.detalles_solicitud_pfdc){
            this.detalle_compra_pfdc.compra = compra;
            this.detalle_compra_pfdc.nombreProducto = detaSoliPFDC.nombreProducto;
            this.detalle_compra_pfdc.cant_existente = detaSoliPFDC.cant_existente;
            this.detalle_compra_pfdc.cant_solicitada = detaSoliPFDC.cant_solicitada;
            this.detalle_compra_pfdc.cant_autorizada = detaSoliPFDC.cant_autorizada;
            this.detalleCompraPFDCService.create(this.detalle_compra_pfdc).subscribe(
              detaCompraPFDC => {
                console.log(detaCompraPFDC);
              });
          }
        }
      });
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
  donde se emitio la solicitud y se almacenan dichas configuraciones en el variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal(solicitud: Solicitud)
  {
    var nombreSucursal = solicitud.nombre_sucursal;
    this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(
      maxMinStockSucursal => {
        if(maxMinStockSucursal === null){
          this.maxStock = 50;
          this.minStock = 5;
        }else{
          this.maxStock = maxMinStockSucursal.max_stock;
          this.minStock = maxMinStockSucursal.min_stock;
        }
      });

    this.maxMinExistenciaService.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(
      maxMinExistenciaSucursal => {
        if(maxMinExistenciaSucursal === null){
          this.maxExistencia = 50;
          this.minExistencia = 5;
        }else{
          this.maxExistencia = maxMinExistenciaSucursal.max_existencia;
          this.minExistencia = maxMinExistenciaSucursal.min_existencia;
        }
      });
      this.cant_autorizada = new FormControl('', [Validators.required, Validators.max(this.maxStock), Validators.min(1)]); //Se cargan las validaciones para el los input de cantidad autorizada
      this.cant_autorizada2 = new FormControl('', [Validators.required, Validators.max(this.maxStock), Validators.min(1)]);
  }

  //Método para mandar correo
  enviarCorreo(solicitud: Solicitud)
  {
    var fecha = new Date;
    var fechaForm = fecha.getDate() + "/" + (fecha.getMonth()+1)+ "/"+fecha.getFullYear();//Formato de fecha para enviar en el correo
    this.mail.para = "16161339@itoaxaca.edu.mx"; //Destinatario, en este caso tendría que ser al correo de quién envía la solicitud
    this.mail.asunto = "Solicitud " + solicitud.estatus;
    this.mail.mensaje = "Su solicitud ha sido " + solicitud.estatus + " por adquisiciones el día: " +
                        fechaForm + ", Para ver a detalle la solicitud se sugiere revisar el sistema";
    this.mailService.enviar(this.mail).subscribe(
      correo => {
        console.log(correo);
        console.log("correo enviado");
      });
  }
}
