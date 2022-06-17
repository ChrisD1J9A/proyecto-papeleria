import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Proveedor } from 'src/app/administracion/modelos/papeleria/proveedor';
import { ProveedoresService } from 'src/app/administracion/servicios/papeleria/proveedores.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  titulo: string = "Agregar nuevo Proveedor";//Titulo de la pagina si se va a agregar un nuevo proveedor
  titulo2: string = "Editar Proveedor";//Titulo de la pagina si se va a editar un proveedor
  proveedor = new Proveedor();//Objeto proveedor
  proveedores: Proveedor[];//Arreglo de proveedores
  nombreProveedor = new FormControl('', [Validators.required]);//Form control para validar el formulario
  telefonoProveedor = new FormControl('1', Validators.pattern('^((\\+91-?)|0)?[0-9]{6,10}$'));//Form control para validar el formulario y se especifica el patron que se espera
  rfcflag: boolean;//Bandera para mostrar un mensaje de validacion
  //patron del RFC, Persona Moral
  _rfc_pattern_pm = "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";
  // patron del RFC, persona fisica
  _rfc_pattern_pf = "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

  rfcProveedor = new FormControl('', [Validators.required]);//Form control para validar el proveedor
  rfcmsg: String; //Variable para mostrar mensaje de validacion para el RFC
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private proveedoresService: ProveedoresService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.banderaCarga = false;
    this.error = false;
    this.cargarProveedor(); //Metodo para cargar un proveedor en caso de se acceda a este componente para editar un proveedor
  }

  //Metodo utilizado para mostrar mensaje de validacion del nombre del proveedor
  getErrorMessage() {
    return this.nombreProveedor.hasError('required') ? 'Ingrese algún dato' : '';
  }

  //Metodo utilizado para mostrar mensaje de validacion del RFC
  getErrorMessage2() {
    return this.rfcProveedor.hasError('required') ? 'Igrese algún dato' : '';
  }

  //Metodo utilizado para mostrar mensaje de validacion del RFC
  getErrorMessage3() {
    return this.telefonoProveedor.hasError('pattern') ? 'Sólo ingrese al menos 6 números' : '';
  }

  //Metodo para cargar un proveedor de la tabla general de proveedores al formulario para editarlo
  cargarProveedor(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'] //Se obtiene el id del proveedor de la ruta
      if (id) {
        this.proveedoresService.getProveedor(id).subscribe(//Se busca en la base de datos mediante el id
          (proveedor) => {
            //Se almacena en el objeto asociado al formulario para que se carguen los datos
            this.proveedor = proveedor
          },
          (err) => {
            //Se detiene el spinner
            this.banderaCarga = false;
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
          });
      } else {
        //Se detiene el spinner
        this.banderaCarga = false;
      }
    })
  }

  //Metodo para validar el rfc del formulario
  ValidaRFC(rfc: any) {
    if (rfc.match(this._rfc_pattern_pm) || rfc.match(this._rfc_pattern_pf)) {//Se valida con respecto al patron establecido al principio
      this.rfcmsg = "La estructura de la clave de RFC es valida";//Mensaje para el caso de que se cumple la estructura del rfc
      this.rfcflag = true;//La bandera para el mensaje se pone en true, en el formulario si esta activa esta vander el mensaje anterior sale en la vista
    } else {
      this.rfcmsg = "La estructura de la clave de RFC es incorrecta";//Mensaje para el caso de que NO se cumple la estructura del rfc
      this.rfcflag = false;//Bandera cambia a false y en el formulario de acuerdo a esta bandera sale el mensaje anteriro
    }
  }

  //Metodo para crear un nuevo proveedor
  public create(): void {
    //se activa el spinner
    this.banderaCarga = true;
    if (this.proveedor.nombre && this.proveedor.rfc) {//Se valida que los datos requerido u obligatorios sean diferentes de null
      if (this.rfcflag == true) {//Se valida si la estructura del rfc fue la correcta
        swal.fire({
          title: '¿Desea guardar este nuevo elemento? ',//Se pregunta al usuario antes de continuar
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.proveedor.estatus = 1;//El estatus por default 1 (Activo)
            this.proveedoresService.create(this.proveedor).subscribe(//Se almacena en la base de datos
              response => {
                if (response.proveedor) {
                  //se desactiva el spinner
                  this.banderaCarga = false;
                  //Mensaje de que la inserción ha sido exitosa
                  swal.fire('Guardado', `El proveedor ${this.proveedor.nombre} fue guardado con éxito!`, 'success');
                  //Se redirecciona al componente donde se muestran todos los proveedores de la base de datos
                  this.router.navigate(['/layout/proveedores']);
                  this.ngOnInit();
                } else {
                  //se desactiva el spinner
                  this.banderaCarga = false;
                  //Mensaje en dado caso de que no se pudo realizar correctamente la actualizacion
                  swal.fire('Oops', 'Ocurrió un error al insertar', 'error');
                }
              },
              (err) => {
                //Detiene el spinner de carga
                this.banderaCarga = false;
                //Si ocurre un error muestra un mensaje de alerta de error
                swal.fire(err.error.mensaje, 'Error al querer insertar el proveedor', 'error');
              });
          } else if (result.isDenied) {
            //se desactiva el spinner
            this.banderaCarga = false;
            swal.fire('El elemento no fue guardado', '', 'info'); //Si el usuario dedice no guardar se muestra este mensaje
          }
        });
      } else {
        //se desactiva el spinner
        this.banderaCarga = false;
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El formato del rfc es incorrecto', //Mensaje para mostrar al usuario de que el rfc es incorrecto
        });
      }
    } else {
      //se desactiva el spinner
      this.banderaCarga = false;
      //Mensaje para mostrarle al usuario que faltan los datos obligatorios
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese los datos requeridos para continuar',
      });
    }
  }

  //Metodo para actualizar un proveedor
  public update(): void {
    //se activa el spinner
    this.banderaCarga = true;
    if (this.proveedor.nombre && this.proveedor.rfc) {//Se valida antes que nada que los datos obligatorios esten rellenados
      if (this.rfcflag == false) {//Se valida si el rfc es correcto
        //se desactiva el spinner
        this.banderaCarga = false;
        swal.fire({//Mensaje de que el rfc es inválido
          icon: 'warning',
          title: 'Oops...',
          text: 'formato del RFC inválido',
        });
      } else {
        swal.fire({
          title: '¿Desea actualizar este elemento?', //Se pregunta al usuario antes de continuar
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.proveedoresService.update(this.proveedor)//Se actualiza el proveedor en la base de datos
              .subscribe((response) => {
                if (response.proveedor) {
                  //se desactiva el spinner
                  this.banderaCarga = false;
                  swal.fire('Actualizado', `El proveedor ${response.proveedor.nombre} actualizado con éxito!`, 'success');//Mensaje de que la actualizacion fue exitosa
                  this.router.navigate(['/layout/proveedores']); //Se redirecciona a la tabla general de proveedores
                  this.ngOnInit();
                }
              })
          } else if (result.isDenied) {
            //se desactiva el spinner
            this.banderaCarga = false;
            swal.fire('El elemento no fue actualizado', '', 'info');//Mensaje de que el proveedor no fue actualizado
          }
        });
      }
    } else {
      //se desactiva el spinner
      this.banderaCarga = false;
      swal.fire({//Mensaje de advertencia al usuario de que los datos necesarios no se han ingresado
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese los datos requeridos para continuar',
      })
    }
  }

  //Metodo para el boton cancelar y no agregar ni actualizar proveedores y regresar a la tabla general de proveedores
  public cancel(): void {
    this.router.navigate(['/layout/proveedores']); //Se redirige al componente donde se muestran los proveedores
    this.ngOnInit();
  }

}
