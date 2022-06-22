import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Producto } from 'src/app/administracion/modelos/papeleria/producto';
import { ProductosService } from 'src/app/administracion/servicios/papeleria/productos.service';
import { Unidad } from 'src/app/administracion/modelos/papeleria/unidad';
import { UnidadService } from 'src/app/administracion/servicios/papeleria/unidad.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {
  titulo: string = "Agregar nuevo Producto"; //Titulo de la pagina si se agrega un nuevo producto
  titulo2: string = "Editar Producto";//Titulo de la pagina si se edita un producto
  producto = new Producto();//Objeto producto
  productos: Producto[];//Arreglo de los productos en la base de datos
  unidad: Unidad = new Unidad();//Objeto Unidad
  unidades: Unidad[];//Agreglo delas unidades
  descripcionProducto = new FormControl('', [Validators.required]);//FormControl Para validad elemento requerido
  unidadProducto = new FormControl('', [Validators.required]);//FormControl Para validad elemento requerido
  bandera: Boolean;//Bandera utilizado para dar formato  de pesos en el formulario
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private productosService: ProductosService,
    private unidadService: UnidadService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.banderaCarga = false;
    this.error = false;
    this.unidadService.getUnidades().subscribe(//Se consulta en la base de datos todas las unidades
      unidades => {
        this.unidades = unidades.filter(u => u.estatus == 1); //Se aplica un filtro a los datos obtenidos, para solo dejar las unidades activas
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
      });
    this.cargarProducto();//Si se accede a este formulario con el objetivo de actualizar un producto, mediante este metodo se obtienen losdatos
    this.cargarProductoFDC();//Si se accede a este formulario con el objetivo de agregar un producto fuera  del catalogo de productos, mediante este metodo se obtienen losdatos
    this.bandera = false;//La bandera se inicializa en false
  }

  //Mensaje de error si el usuario no ingreso un dato en un campo requerido
  getErrorMessage() {
    return this.descripcionProducto.hasError('required') ? 'algún dato' : '';
  }

  //Metodo mediante el cual se da cierto formato a los input de iva y precio total
  precio_input1(n: any) {
    this.producto.precio_iva = n * 0.16;//Se aplica el porcentaje de iva a la cantidad ingresada pro el  usuario
    this.producto.precio_iva = parseFloat((Math.round(this.producto.precio_iva * 100) / 100).toFixed(2));//Se aplica un formato de solo  dos decimales
    this.producto.precio_total = (this.producto.precio_subtotal + this.producto.precio_iva);//Para el precio total se suma la cantidad ingresada por el usuario  + el iva
    this.producto.precio_total = parseFloat((Math.round(this.producto.precio_total * 100) / 100).toFixed(2));//Se aplica un formato de solo  dos decimales
    if (n % 1 == 0) { //Se hace una validacion para saber si n (Valor ingresado por el usuario) tiene decimales
      this.bandera = true;//Si si tiene decimales la bandera cambia a true y en la vista se agrega un .00 pesos al formulario
    } else {
      this.bandera = false;//Si no tiene decimales la bandera cambia a false y enla vista solo queda la palabra pesos
    }
  }

  //Metodo que entra en funcion cuando el usuario edita el input del IVA
  precio_input2() {//Recibe un numero
    this.producto.precio_total = (this.producto.precio_subtotal + this.producto.precio_iva); //Suma el precio del producto mas el iva que el usuario edito
    this.producto.precio_total = parseFloat((Math.round(this.producto.precio_total * 100) / 100).toFixed(2)); //Esta parte es para darle formato de pesos y redondear a dos decimales
  }

  //Método mediante el cual se carga un producto proveniente de la base de datos y poder editarlo en el formulario
  cargarProducto(): void {
    //Se inicializa el spinner
    this.banderaCarga = true;
    this.activatedRoute.params.subscribe(params => { //Cuando se edita un producto este genera una ruta, al final de esta ruta viene el id_producto
      let id: number = params['id']//Guardamos en una variable dicha id_producto
      if (id) {//Corroboramos que exista
        if (isNaN(id) == false) { //Corroboramos que id sea un numero
          this.productosService.getProducto(id).subscribe(//Consultamos en la base de datos mediante la id obtenida
            (producto) => {
            this.producto = producto//Se guarda en la variable producto y queda cargado al formulario
            this.banderaCarga = false;
          },
          (err) => {
            //Se detiene el spinner
            this.banderaCarga = false;
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
          });
        }
      }else{
        //Se detiene el spinner
        this.banderaCarga = false;
      }
    })
  }

  //Metodo mediante el cual se carga un producto de la lista de productos fuera del catalogo
  cargarProductoFDC(): void {
    this.activatedRoute.params.subscribe(params => { //El nombre del producto viene cargado al final de la ruta
      let nombre: string = params['nombre']//Guardamos el nombre del producto
      if (nombre) {//Se corrobora que exista el nombre
        this.producto.descripcion = nombre;//Se almacena en la descripcion del producto y el nombre queda cargado en el formulario
      }
    });
  }

  //Metodo que entra en funcion cuando el usario guarda un producto nuevo
  public create(): void {
    this.banderaCarga=true;
    if (this.producto.descripcion && this.producto.unidad) {//El campo obligatorio se corrobora aqui
      swal.fire({
        title: '¿Desea guardar este nuevo elemento? ',//Se pregunta al usuario antes de proceder
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.producto.estatus = 1; //Estatus por default 1(Activo)
          this.productosService.create(this.producto).subscribe(//Se crea y almacena en la base de datos
            (response) => {
              if(response.producto)
              {
                //Se muestra un mensaje exitoso
                swal.fire('Guardado', `El producto ${this.producto.descripcion} fue guardado con éxito!`, 'success')
                //Se redirige al apartado donde se encuentran todos los productos
                this.router.navigate(['/layout/productos']);
                this.ngOnInit();//Se deja este componente en su estado inicial
              } else {
                //Mensaje en dado caso de que no se pudo realizar correctamente la actualizacion
                swal.fire('Oops', 'Ocurrió un error al insertar', 'error');
               }
            },
            (err) => {
              //Detiene el spinner de carga
              this.banderaCarga = false;
              //Si ocurre un error muestra un mensaje de alerta de error
              swal.fire(err.error.mensaje,'Error al querer insertar el producto','error');
            });
        } else {
          //Se detiene el spinner
          this.banderaCarga = false;
          //Si el usuario no decide guardar el producto se envia un mensaje confirmando su desicion
          swal.fire('El elemento no fue guardado', '', 'info');
        }
      })
    } else {
      //se desactiva el spinner
      this.banderaCarga = false;
      swal.fire({//En caso de que el dato requerido esté vacío
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese los datos requeridos para continuar',
      });
    }
  }

  //Metodo utilizado para actualizar un producto
  public update(): void {
    //Se activa el spinner
    this.banderaCarga = true;
    if (this.producto.descripcion) { //Se corrobora que el dato obligatorio no este vacío
      swal.fire({
        title: '¿Desea actualizar este elemento?', //Se pregunta al usuario antes de continuar
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.productosService.update(this.producto)
            .subscribe((response) => { //Se actualiza el producto en la base de datos
              this.router.navigate(['/layout/productos']); //Se redirige al apartado donde se listan los productos
              this.ngOnInit();//El componente se deja en su estado inicial
            },
            (err) => {
              //Detiene el spinner de carga
              this.banderaCarga = false;
              //Si ocurre un error muestra un mensaje de alerta de error
              swal.fire(err.error.mensaje,'Error al querer insertar el producto','error');
            });
          swal.fire('Actualizado', `El Producto ${this.producto.descripcion} actualizado con éxito!`, 'success')//Se muestra al usuario un mensaje exitoso
        } else {
          //Detiene el spinner de carga
          this.banderaCarga = false;
          swal.fire('El elemento no fue actualizado', '', 'info'); //Si el usuario decideno actualizar
        }
      });
    } else {
      //se desactiva el spinner
      this.banderaCarga = false;
      swal.fire({//Mensaje de alerta para que el usuario se de cuena que no ingresó el dato obligatorio
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  //Metodo que funciona y entra en funcionamiento cuando el usuario decide no guardar o actualizar algun producto
  public cancel(): void {
    this.router.navigate(['/layout/productos']);//Se redirige a donde se encuentra el listado de productos
    this.ngOnInit();//Se deja el componente en su estado inicial
  }
}
