import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud';
import { Detalle_solicitud } from '../../../administracion/modelos/papeleria/detalle_solicitud';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { SolicitudesService } from '../../../administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from '../../../administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud_pfdc } from '../../../administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { DetalleSolicitudPFDCService } from '../../../administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { Detalle_compra_pfdc } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
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
  detalle_solicitud_PFDC = new Detalle_solicitud_pfdc(); //detalle de solicitud con productos fuera del catalogo
  detalle_compra_pfdc = new Detalle_compra_pfdc(); //detalle de compra con productos fuera del catalogo
  compra = new Compra();//Objeto compra
  detalle_compra = new Detalle_compra();//Objeto de Detalle_compra
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];//Encabezados para las columnas de los detalles de solicitud
  displayedColumns2: string[] = ['descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada'];//Encabezados para las columnas de los detalles de Detalle_solicitud_pfdc
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
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

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
    this.banderaCarga = false;
    this.error = false;
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
          (response) => {//SE BUSCA LA Solicitud mediante el id
            this.solicitud = response.solicitud;//se guarda la solicitud
            this.obtenerMaximosMinimosDeLaSucursal(response.solicitud);//se cargan las configuraciones de la sucursal donde se emite la solicitud
            if (this.solicitud.estatus === "Pendiente") {//Si el estus es pendiente
              this.flag = false;//Entonces se muestran componentes para una solicitud pendiente
            } else {
              this.flag = true;//Entonces se muestran componentes para una solicitud que no es pendiente(Rechazada o aceptada)
            }
            this.detalleSolicitudService.getDetallesSolicitud(id).subscribe(
              deta_solicitudes => {//Se obtienen los detalles de la solicitud mediate el id
                this.dataSource = new MatTableDataSource(deta_solicitudes);//Se cargan los datos a la tabla
                this.detalles_solicitud = deta_solicitudes; //Se guardan los datos en su lista
              });
            this.detalleSolicitudPFDCService.getDetallesSolicitud_pfdc(id).subscribe(
                detalles_solicitudesPFDC => {//Se obtienen los detalles de la solicitud con productos fuera del catalogo mediate el id
                  this.dataSource2 = new MatTableDataSource(detalles_solicitudesPFDC); //Se cargan los datos a su tabla
                  this.detalles_solicitud_pfdc = detalles_solicitudesPFDC;//Se guardan los datos en su lista
            });
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

  //Para el caso en el que el estatus de que la solicitud sea pendiente, y se regitre acepte la solicitud en este método se validan los input donde se especifica
  //cuanta cantidad de X producto se autoriza
  validarDetalles(): boolean {
    let bandera = false;//Bandera que devolera este metodo, de ser true quiere decir que hay error en el fomulario, de lo contrario no hay error
    for (this.detalle_solicitud of this.detalles_solicitud) {//Se recorren inicialmente los productos dentro del catalogo
      //La cantidad autorizada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
      if (this.detalle_solicitud.cant_autorizada == null || this.detalle_solicitud.cant_autorizada < 1 || this.detalle_solicitud.cant_autorizada > this.maxStock) {
        bandera = true;
      }
    }

    for (this.detalle_solicitud_PFDC of this.detalles_solicitud_pfdc) {//Se recorren los productos fuera del catalogo
      //La cantidad autorizada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
      if (this.detalle_solicitud_PFDC.cant_autorizada == null || this.detalle_solicitud_PFDC.cant_autorizada < 1 || this.detalle_solicitud_PFDC.cant_autorizada > this.maxStock) {
        bandera = true;
      }
    }
    return bandera;
  }

  //Metodo para guardar/Actualizar la solicitud
  guardarSolicitud(): void {
    //Se inicializa el spinner
    this.banderaCarga = true;
    if (this.validarDetalles()) {//Se valida los input donde se ingresó la cantidad autorizada
      //Se detiene el spinner
      this.banderaCarga = false;
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
                      //Se detiene el spinner
                      this.banderaCarga = false;
                    } else {
                      swal.fire('Mensaje',`Error al aceptar la solicitud`,'error');
                    }
                  })
              },
              (err) => {
                //Se detiene el spinner
                this.banderaCarga = false;
                //Mensaje de error en caso de no almacenarse la solicitud
                swal.fire('Error',`Error al aceptar la solicitud`,'error');
              });
          } else {
            //Se detiene el spinner
            this.banderaCarga = false;
            swal.fire('La solicitud no fue guardada', '', 'info');
          }
        })
      } else {
        //Se detiene el spinner
        this.banderaCarga = false;
        swal.fire('Deje algún comentario para continuar', '', 'info')
      }
    }
  }

  //Método utilizado para rechazar una solicitud
  rechazarSolicitud(): void {
    //Se inicializa el spinner
    this.banderaCarga = true;
    //El unico requisito que se requiere para rechazar una solicitud es que el usuario deje un comentario y aqui se evalua
    if (this.solicitud.observacion_aprobacion_rechazo) {
      swal.fire({
        title: '¿Está seguro de rechazar esta solicitud? ',//Se consulta al usuario antes de continuar
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No, seguir viendo`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.solicitud.estatus = "Rechazada";//El estatus cambia a Rechazada
          this.solicitud.fecha_rechazo = new Date();//Se establece la fecha del rechazp
          //Se obtiene el nombre del usuario logeado para registrarlo como la persona quien rechaza la solicitud
          this.solicitud.usuario_aprob = JSON.parse(localStorage.getItem('nombreCUsuario')!);
          this.solicitudesService.update(this.solicitud).subscribe(//Se realiza la actualizacion en la base de datos
            solicitud => {
              if (solicitud) {
                //Se notifica al usuario de que el rechazo se efectuó exitosamente
                swal.fire('Mensaje',`La solicitud:  ${solicitud.id_solicitud} fue rechazada con éxito`,'success');
                this.enviarCorreo(solicitud);//Se envia un correo electronico notificando el estatus de la solicitud
                //Se redirecciona a la tabla donde se muestran todas las solicitudes
                this.router.navigate(['/layout/solicitudes-adquisiciones']);
                //Se detiene el spinner
                this.banderaCarga = false;
              } else {
                //Se detiene el spinner
                this.banderaCarga = false;
                //Error en caso de haberlo
                swal.fire('Mensaje',`Error al rechazar la solicitud`,'error');
              }
            },
            (err) => {
              //Se detiene el spinner
              this.banderaCarga = false;
              //Mensaje de error en caso de no almacenarse la solicitud
              swal.fire(err,`Error al rechazar la solicitud`,'error');
            });
        }else{
          //Se detiene el spinner
          this.banderaCarga = false;
        }
      })
    } else {
      //Se detiene el spinner
      this.banderaCarga = false;
      swal.fire('Deje un comentario para continuar', '', 'info');//Mensaje de aviso
    }
  }

  //Cuando se acepta una solicitud este metodo crea una Compra para que posteriormente el usuario que envió solicitud pueda registrar la compra respectiva
  crearCompra()
  {
    var detallesoli = new Detalle_solicitud();//Objeto Detalle_solicitud
    this.compra.solicitud = this.solicitud; //La nueva compra se le asocia la solicitud que se acepta
    this.compra.estatus = 'En proceso';//La compra nueva por default se deja el estatus en proceso
    this.compra.idSucursal = this.solicitud.idSucursal;//Se le asigna a la copra el id_de la sucursal al que le pertenece
    this.compra.nombre_sucursal = this.solicitud.nombre_sucursal;//Tambien el nombre
    this.comprasService.create(this.compra).subscribe(
      compra => {//Se registra la compra en la base de datos
        //Al igual que la solicitud, la compra registra los productos asi como las cantidades de existente, solicitdada y
        //autorizada y por ello en este ciclo se asignan los mismos datos que detalle solicitud
        for (detallesoli of this.detalles_solicitud){
          this.detalle_compra.compra = compra;//Se le asigna al detalle compra la compra correspondiente
          this.detalle_compra.producto = detallesoli.producto;//Se le asigna producto
          this.detalle_compra.cant_existente = detallesoli.cant_existente;//la cantidad existente
          this.detalle_compra.cant_solicitada = detallesoli.cant_solicitada;//la cantidad solicitada
          this.detalle_compra.cant_autorizada = detallesoli.cant_autorizada;//la cantidad cant_autorizada
          this.detalleCompraService.create(this.detalle_compra).subscribe(
            detalles =>{//Se crea cada detalle conforme se realiza el ciclo for
              console.log(detalles);
            });
        }
        //Si se realizo una solicitud con productos fuera del catalogo se registran los detalles correspondientes
        if(this.solicitud.pfdc===true){
          var detaSoliPFDC = new Detalle_solicitud_pfdc();
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
      },
      (err) => {
        //Mensaje de error en caso de no almacenarse la solicitud
        swal.fire(err,`Error al rechazar la solicitud`,'error');
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
