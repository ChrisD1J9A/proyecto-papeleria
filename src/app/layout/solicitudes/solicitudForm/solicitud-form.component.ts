import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/administracion/modelos/papeleria/solicitud';
import { SolicitudesService } from 'src/app/administracion/servicios/papeleria/solicitudes.service';
import { DetalleSolicitudService } from 'src/app/administracion/servicios/papeleria/detalle-solicitud.service';
import { Detalle_solicitud } from 'src/app/administracion/modelos/papeleria/detalle_solicitud';
import { DetalleSolicitudPFDCService } from 'src/app/administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { Detalle_solicitud_pfdc } from 'src/app/administracion/modelos/papeleria/detalle_solicitud_PFDC';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { Mail } from 'src/app/administracion/modelos/papeleria/Mail';
import { MailService } from 'src/app/administracion/servicios/papeleria/mail.service';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/administracion/modelos/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class SolicitudFormComponent implements OnInit {
  solicitud = new Solicitud();//Objeto solicitud
  date = new Date();//Fecha actual para asignar a la solicitud
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'action'];//Datos de cabecera para la tabla
  deta: Detalle_solicitud; //OObjeto detalLe solicitud
  deta2: Detalle_solicitud_pfdc; //Objeto detalle solicitud de productos fuera del catalogo
  dataSource = new MatTableDataSource();//Tabla de productos del catalogo
  productosSeleccionados = new Set<Producto>();//Lista para almacenar los productos seleccionados del catalogo
  producto = new Producto(); //Objeto producto
  pds = new Array(); //Lista para almacenar los productos de la base de datos
  horizontalPosition: MatSnackBarHorizontalPosition = 'center'; //variable para asignar a mensaje
  verticalPosition: MatSnackBarVerticalPosition = 'top';//variable para asignar a mensaje
  nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!); //Asignar la sucursal desde donde se logea
  idSucursal: any;
  nombre_usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);//Asignar el nombre del usuario que se logeo
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock
  maxExistencia: number;  //configuracion de maximo de existencia
  minExistencia: number; //configuracion de minimo de existencia
  mail = new Mail();

  constructor(private productosService: ProductosService,
    private formBuilder: FormBuilder,
    private solicitudesService: SolicitudesService,
    private router: Router,
    private detalleSolicitudService: DetalleSolicitudService,
    private detalleSolicitudPFDCService: DetalleSolicitudPFDCService,
    private mailService: MailService,
    private maxMinStockService: MaxMinStockService,
    private maxMinExistenciaService: MaxMinExistenciaService,
    private _snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>) {
    const currentYear = new Date().getFullYear();
  }

  //Para poder obtener datos de detalles de solicitud (Formularios reactivos)
  get detalles(): FormArray {
    return this.detalleSForm.get('detalles') as FormArray;
  }

  //Para poder obtener datos de detalles de solicitud productos fuera del catalogo(Formularios reactivos)
  get detalles2(): FormArray {
    return this.detalleSPFDCForm.get('detalles2') as FormArray;
  }

  //Formulario reactivo que incluye por default información de acuerdo al usuario logeado
  solicitudForm = this.formBuilder.group({
    nombre_usuario: [this.nombre_usuario],
    id_sucursal: [this.nombreSucursal],
    fecha_solicitud: [this.date],
    observacion_solicitud: [''],//a excepción de los comentario, cuyo campo se podrá editar
  });

  //Formulario reacitivo para los productos seleccionados de la tabla o catalogo de productos
  detalleSForm = this.formBuilder.group({
    detalles: this.formBuilder.array([])
  })

  //Formulario reactivo para los productos que no se encuentran en el catalogo de productos
  detalleSPFDCForm = this.formBuilder.group({
    detalles2: this.formBuilder.array([])
  })

  /*Al iniciar este componente se cargaran al dataSource (para la tabla de productos)
  los productos activos (1) para mostrarlos en el formulario*/
  ngOnInit(): void {
    this.productosService.getProductos().subscribe(
      productos => {//Se obtienen todos los productos de la base de datos
        this.pds = productos.filter(p => p.estatus === 1);//se realiza un filtro para obtener solo los productos activos
        this.dataSource = new MatTableDataSource(this.pds);//Se cargan a la tabla
      });
    this.idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);//Se obtiene la sucursaldesde donde se inicio sesion
    this.obtenerMaximosMinimosDeLaSucursal();//Se obtiene la configuracion de maximos y minimos de la sucursal logeada
  }

  //Metodo para realizar busquedas en la tabla de productos
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*Método en dónde una vez que se decida envíar una solicitud,validará los datos y si no hay
  inconvenientes se guarda la solicitud*/
  submit(): void {
    if (this.productosSeleccionados.size > 0 || this.detalles2.getRawValue().length > 0) {//Validacion que corrobora que al menos un producto este seleccionado, ya sea que sea o no parte del catalogo de productos
      if (this.detalles.valid && this.detalles2.valid) {//Corrobora que los formularios no tengan datos invalidos para el sistema
        this.solicitud = this.solicitudForm.value; //Toma los datos establecidos en el sistema y los asigna al Objeto Solicitud
        this.solicitud.estatus = "Pendiente";//Como será una nueva solicitud, su estatus será el de pendiente
        this.solicitud.id_sucursal = this.idSucursal; //Se le asigna el id de la sucursal
        this.solicitud.nombre_sucursal = this.nombreSucursal; //se le asigna el nombre de la sucursal
        if (this.detalles2.getRawValue().length >= 1) { //Corrobora si hay uno o mas productos que no formen parte del catalogo de productos...
          this.solicitud.pfdc = true; //se le asigna un true en caso de haber un producto fuera del catalogo
        } else {
          this.solicitud.pfdc = false;//se le asigna un falsa en caso de que solo tener productos dentro del catalogo
        }
        swal.fire({
          title: '¿Desea hacer una nueva solicitud? ',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {//Una vez que los formularios no contengan errores y el usuario decida continuar...
            this.solicitudesService.create(this.solicitud).subscribe(
              solicitud => { //Se hace un post al back end para almacenar la solicitud en la base de datos
                for (var i = 0; i < this.detalles.getRawValue().length; i++) {//Se hace un ciclo for para recorrer los productos seleccionados del catalogo
                  this.deta = this.detalles.value.pop();
                  this.deta.solicitud = solicitud;//extrer cada detalle y asignarle la solicitud al que pertenece
                  this.detalleSolicitudService.create(this.deta).subscribe( //Hacer un post al back para almacenar en la bd
                    detalle => {
                      console.log("done");
                    });
                }
                if (this.detalles2.getRawValue().length >= 1) { //Si hay algun producto que este fuera del catalogo de productos
                  for (var i = 0; i < this.detalles2.getRawValue().length; i++) {//Se hace un ciclo for para recorrer dichos productos
                    this.deta2 = this.detalles2.value.pop();
                    this.deta2.solicitud = solicitud;
                    this.detalleSolicitudPFDCService.create(this.deta2).subscribe(//Se hace un post y se almacena en la bd
                      detalle2 => {
                        console.log("done");
                      });
                  }
                }

                if (solicitud.id_solicitud) {//Si la solicitud se almacenó con exito en la bd, el sistema notifica al usuario
                  swal.fire(
                    'Mensaje',
                    `La solicitud fue enviada con éxito y queda como ${solicitud.estatus}`,
                    'success'
                  );
                  this.enviarCorreo(solicitud);
                  this.router.navigate(['/layout/solicitudes']) //Se redirecciona a la tabla general de solicitudes en caso de no presentar errores
                } else {
                  swal.fire(
                    'Mensaje',
                    `Error al envíar la solicitud`, //Mensaje de error en caso de no almacenarse la solicitud
                    'error'
                  );
                }
              })

          } else if (result.isDenied) {
            swal.fire('La solicitud no fue guardada', '', 'info');//en caso de que el usuario no decidiera continuar resalta este mensaje
          }
        })
      }else{
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hay datos inválidos en el formulario', //en caso de haber errores en los formularios resalta este mensaje
        });
      }
    }else {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe de elegir al menos un producto!', //En caso de que el usuario no seleccionó o agrego algún producto
      });
    }
  }

//Mentodo que acciona el boton de cancelar y retorna a la tabla general de solicitudes
  cancelar(): void {
    swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de cancelar esta solicitud y volver a Solicitudes",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, Cancelar!',
      cancelButtonText: 'Seguir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/layout/solicitudes'])
      }
    })
  }

//Metodo para eliminar absolutamente todos los productos seleccionado del catalogo o los que no estén dentro del catalogo
  eliminarTodo(): void {
    swal.fire({
      title: '¿Está seguro?',
      text: "Está a punto de borrar los productos seleccionados para su solicitud",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrar todo!',
      cancelButtonText: 'Seguir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosSeleccionados.clear();//Limpia la lista de seleccionados
        this.detalles.clear();//limpia el formulario de productos del catalogo
        this.detalles2.clear();//limpia el formulario de productos fuera del catalogo
        this.ngOnInit();//reestablece los datos iniciales
      }
    });
  }

//Método para accionar un mensaje de que se ha seleccionado un producto
  snackBarSuccess() {
    this._snackBar.open('Producto seleccionado ✔️', 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
      panelClass: ['mySnackbarSucess']
    });
  }

  //Método para accionar un mensaje de que se ha removido un producto
  snackBarDelete() {
    this._snackBar.open('Producto removido ❌', 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
      panelClass: ['mySnackbarDelete']
    });
  }

  /*Metodo que entra en operación en el momento que el usuario agregue a su lista de solicitud un producto*/
  agregarProducto(producto: Producto) {
    var indice = this.pds.findIndex(p => p === producto); //Aquí se obtiene el indice del producto seleccioado
    this.pds.splice(indice, 1); //se elimiina de la lista el producto seleccionado
    this.dataSource = new MatTableDataSource(this.pds); //y se actualiza la tabla
    this.snackBarSuccess();
    this.productosSeleccionados.add(producto); // añade el producto seleccionado a una lista auxiliar para llevar un control
    this.agregarDetalles(producto); //agregar el formulario para el producto que se selecciono
  }

  /*Metodo que entra en operación en el momento que el usuario agregue a su lista de solicitud un producto fuera del catalogo*/
  agregarProductoFueraDelCatalogo() {
    this.agregarDetallesPFDC();
  }

  /*Método que elimina el formulario del producto seleccionado y retorna el producto en cuestion a la lista o tabla
  de productos*/
  eliminarProducto(index: number) {
    //this.productosSeleccionados.delete(p);
    var i = 0;
    for (let producto of this.productosSeleccionados) {
      if (index === i) {
        this.producto = producto; //localiza el producto dentro de la lista de productos seleccionados
      }
      i++;
    }
    this.pds.push(this.producto); //el producto se agrega nuevamente a la lista dónde se encuentran los demás productos
    this.pds.sort((a, b) => a.id_producto - b.id_producto);//se realiza un sort para ordenaor los producto de acuerdo al id_producto
    this.dataSource = new MatTableDataSource(this.pds);//se vuelve a cargar los datos a la tabla
    this.productosSeleccionados.delete(this.producto);//Se elimina el producto de la lista de productos seleccionados
    this.removerDetalles(index);//Borra el formulario creado para el producto
    this.snackBarDelete();//mensaje de aviso que fue el producto removido de la lista
  }

  /*Método que recibe el producto seleccionado de la lista/tabla de productos y agraga el formulario adecuado
  para dicho producto */
  agregarDetalles(p: Producto) {
    const detalleFormC = this.formBuilder.group({
      producto: [p],
      producto_: [p.descripcion],
      cant_existente: ['', { validators: [Validators.required, Validators.min(0), Validators.max(this.minExistencia)] }],
      cant_solicitada: ['', { validators: [Validators.required, Validators.min(1), Validators.max(this.maxExistencia)] }]
    });
    this.detalles.push(detalleFormC);
  }

  /*Metodo que agrega el formulario para los productos que estén fuera del catálogo */
  agregarDetallesPFDC() {
    const detallePFDCFormC = this.formBuilder.group({
      nombreProducto: ['', { validators: [Validators.required ] }],
      cant_existente: ['', { validators: [Validators.required, Validators.min(0), Validators.max(this.minExistencia)]}],
      cant_solicitada: ['', { validators: [Validators.required, Validators.min(1), Validators.max(this.maxExistencia)]}]
    });
    this.detalles2.push(detallePFDCFormC);
  }

  //Metodo que sirve para remover el formulario de un producto seleccionado del catalogo
  removerDetalles(indice: number) {
    this.detalles.removeAt(indice);
  }

  //Metodo que sirve para remover el formulario de un producto fuera del catalogo
  removerDetalles2(indice: number) {
    this.detalles2.removeAt(indice);
  }

  //Método para mandar correo
  enviarCorreo(solicitud: Solicitud)//Recibe un objeto de tipo solicitud para obtener informacion de la solicitud que se emite
  {
    var fecha = new Date;
    var fechaForm = fecha.getDate() + "/" + (fecha.getMonth()+1)+ "/"+fecha.getFullYear();//Formato de fecha para enviar en el correo
    this.mail.para = "16161339@itoaxaca.edu.mx"; //Se tiene un objeto Mail y en esta sección se modifica el destinatario
    this.mail.asunto = "Nueva solicitud, solicitud: " + solicitud.id_solicitud; //Seccion para agregar el asunto del mail
    this.mail.mensaje = "Se ha realizado una nueva solicitud por el usuario: "//Seccion para establecer el mensaje del correo
                    + solicitud.nombre_usuario + //Nombre del usario quien realiza la Solicitud
                    " de la sucursal: " + solicitud.nombre_sucursal + //Sucursal desde donde se emite la solicitud
                    " el día: " + fechaForm + //Fecha formateada
                    ", Para ver a detalle la solicitud se sugiere revisar el sistema";
    this.mailService.enviar(this.mail).subscribe(//Una vez que quedó escrito el contenido del correo procede a enviarse a traves del backend
      correo => {
        console.log(correo);
        console.log("correo enviado");
      });
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
  donde se esta logeando y se almacenan dichas configuraciones en variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal()
  {
    var nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!); //Al iniciar sesion se guarda la sucursal desde donde se ingresa en el localStorage, Aquí solo guardamos en  una variable esa informacion
    this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(//Se consulta en la base de datos si existe la configuracion de max y min de la sucursal donde se ingresa
      maxMinStockSucursal => { //El back devuelve el objeto en caso  de existir configuracion, en caso  contrario  devolvera null
        if(maxMinStockSucursal === null){//En dado caso de que la sucursal no tenga configuracion, se le asignan valores por default
          this.maxStock = 50;
          this.minStock = 5;
        }else{ //En caso de que si hay configuracion se guardan en las variables correspondientes
          this.maxStock = maxMinStockSucursal.max_stock;
          this.minStock = maxMinStockSucursal.min_stock;
        }
      });

    this.maxMinExistenciaService.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(//Se consulta en la base de datos si existe la configuracion de max y min de la sucursal donde se ingresa
      maxMinExistenciaSucursal => { //El back devuelve el objeto en caso  de existir configuracion, en caso  contrario  devolvera null
        if(maxMinExistenciaSucursal === null){//En dado caso de que la sucursal no tenga configuracion, se le asignan valores por default
          this.maxExistencia = 50;
          this.minExistencia = 5;
        }else{//En caso de que si hay configuracion se guardan en las variables correspondientes
          this.maxExistencia = maxMinExistenciaSucursal.max_existencia;
          this.minExistencia = maxMinExistenciaSucursal.min_existencia;
        }
      });
  }

}
