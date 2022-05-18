import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { Proveedor } from '../../../administracion/modelos/papeleria/proveedor';
import { Inventario } from '../../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../../administracion/modelos/papeleria/detalle_inventario';
import { ProveedoresService } from '../../../administracion/servicios/papeleria/proveedores.service';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { InventarioService } from '../../../administracion/servicios/papeleria/inventario.service';
import { Detalle_compra_PFDC } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { DetalleInventarioService } from '../../../administracion/servicios/papeleria/detalle-inventario.service'
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { TicketViewComponent } from '../../compras-adquisiciones/compra/ticket/ticket-view.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-compra-fview',
  templateUrl: './compra-fview.component.html',
  styleUrls: ['./compra-fview.component.scss']
})
export class CompraFViewComponent implements OnInit {
  compra = new Compra();//Objeto compra
  detalle_compra = new Detalle_compra();//Objeto detalle compra
  detalles_compra = new Array();//Arreglo para almacenar los detalles de compra
  detalles_inventario: Detalle_inventario[];//Areglo para almacenar los detelles de inventario
  detalle_compra_PFDC = new Detalle_compra_PFDC();//Objeto detalle compra de productos fuera del catalogo
  detalles_compra_PFDC = new Array();//Arrego para los detalles compra de productos fuera del catalogo
  proveedor = new Proveedor();//Objeto proveedor
  proveedores: Proveedor[];//Arreglo para proveedores
  inventario: Inventario;//Objeto inventario
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada'];//Encabezados para las columnas de los detalles de la compra
  dataSource = new MatTableDataSource(); //Tabla para mostrar los detalles de la compra
  dataSource2 = new MatTableDataSource();//Tabla para mostrar los detalles de la compra con productos fuera del catalogo
  nombreProveedor: String;//Variable para almacenar el nombre del proveedor de la compra
  banderaEditar: Boolean;//Bandera para determinar que los input se puedan editar o no
  private ticket: File; //Objeto ticket de tipo files
  fecha_compra = new FormControl('', [Validators.required]); //Form control para evaluar la fecha de la compra
  numericos = new FormControl('', [Validators.required]);//form control para evaluar los input en donde se ingresan numeros
  mensajet = "Ticket no seleccionado";//Mensaje para mostrar en la vista
  today = new Date(); //Para almacenar la fecha actual del sistema
  minDate: Date; //Objeto tipo Date para establecer la fecha minima desde donde elegir en el datePicker
  bandera = true; //
  pfdcFlag: boolean; //Bandera para evaluar que en la compra hay productos fuera del catalogo
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock
  maxExistencia: number;  //configuracion de maximo de existencia
  minExistencia: number; //configuracion de minimo de existencia
  numeroSolicitud: number;//Variable para almacenar el id de la solicitud al que pertenece la compra
  precioFormateado: string; //variable que se usa para dar formato de pesos en el input gasto total

  constructor(private comprasService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private proveedoresService: ProveedoresService,
    private inventarioService: InventarioService,
    private detaInventarioService: DetalleInventarioService,
    private detalleCompraPFDCService: DetalleCompraPFDCService,
    private maxMinStockService: MaxMinStockService,
    private maxMinExistenciaService: MaxMinExistenciaService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 12, 31);
  }

  ngOnInit(): void {
    this.cargarCompra();//Metodo para cargar la compra
    this.proveedoresService.getProveedores().subscribe(//obtener los proveedores de la base de datos
      proveedores => {
        this.proveedores = proveedores.filter(p => p.estatus == 1);
      });
    this.obtenerMaximosMinimosDeLaSucursal();//Obtener las configuraciones de maximos y minimos de la sucursal al que le pertenece la compra
  }

  //Metodo que devuelve mensaje para validar si la fecha (Dato obligatorio) fue seleccionada
  getErrorMessage() {
    return this.fecha_compra.hasError('required') ? 'Seleccione una fecha' : '';
  }

  //Metodo que devuelve mensaje para validar los input numericos
  getErrorMessage2() {
    return 'Ingrese una cantidad válida';
  }

  //En este método se da formato de  pesos al input que registra precios, en este caso del gasto gasto_total
  formatoDePesos(element) {
    if (isNaN(this.compra.gasto_total) || this.compra.gasto_total== 0.00) {//Primero evaluamos que el usuario ingreso un numero real o si ingreso un numero diferente de 0.0
      swal.fire('No es una cantidad válida', 'Ingrese una cantidad válida', 'error');//Si no es un numero o si el numero es un 0.0 se lanza el mensaje de error
      this.compra.gasto_total = 0.0;//En caso de haber los mencionados errores se deja en el input el valor de 0.0 para que el usuario vuelva a registrar correctamene
    } else {
      this.precioFormateado = this.compra.gasto_total.toString();//El gasto total que se registra lo pasamos a un string para darle formato de pesos
      this.precioFormateado = this.currencyPipe.transform(this.precioFormateado, '$');//Con la ayuda de CurrencyPipe se le da el formato de pesos
      element.target.value = this.precioFormateado; //El formato anteriormente establecido se pasa al input para que visualmente se vea con dicho formato
    }
  }

  /*total_input(n: any) {
    if (n % 1 == 0) {
      this.bandera = true;
      console.log(n);
      console.log(this.bandera);
    } else {
      this.bandera = false;
      console.log(n);
      console.log(this.bandera);
    }
  }*/

  //Metodo mediante el cual se carga la compra desde la base de datos
  cargarCompra(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']//Se obtiene el id de la compra mediante la ruta, el id se cargo desde el componente donde se listan todas las compras
      if (id) { //Se valida que exista dicha id
        this.comprasService.getCompra(id).subscribe(
          (compra) => {//Se busca en la base de datos la compra mediante la id anteriormente cargada
            this.compra = compra; //Se guarda en el objeto
            this.precioFormateado = this.compra.gasto_total.toString();//El gasto total que se registra lo pasamos a un string para darle formato de pesos
            this.precioFormateado = this.currencyPipe.transform(this.precioFormateado, '$');
            this.proveedor = this.compra.proveedor; //El proveedor de la compra se aisla en su propio objeto
            this.numeroSolicitud = compra.solicitud.id_solicitud;//Se aisla tambien el id de la solicitud desde la cual viene la compra
            if (this.proveedor) { //Para evitar errores en consola corroboramos que exista el proveedor
              this.nombreProveedor = this.proveedor.nombre;//Para guardar su nombre y mostrarlo en la vista
            } else {
              this.nombreProveedor = ""; //O dejar en blanco este nombre para que no necesariamente sea null
            }
            if (compra.estatus == 'Completada') {//En este punto se evalua el estatus de la compra
              this.banderaEditar = false;//De ser una compra Completada implica que la compra no puede ser editada de nuevo, por lo tanto esta bander deja los input en readonly
            } else {
              this.banderaEditar = true;//De ser un compra pendiente la banderaEditar se vuelve true y por lo tanto se permite editar o escribir en los input
            }

            if (compra.solicitud.pfdc) {//Esta variable que pertenece en a la tabla de solicitud de ser true implica que la solicitud contiene productos fuera del catalogo
              this.detalleCompraPFDCService.getDetallesCompra_PFDC(compra.id_compra).subscribe(
                detalles_ComprasPFDC => {//De tener productos fuera del catalogo, se obtienen los datos respectivos mediante el id_compra
                  this.dataSource2 = new MatTableDataSource(detalles_ComprasPFDC);//Los datos obtenidos se cargan a la tabla
                  this.detalles_compra = detalles_ComprasPFDC; //se cargan al arreglo respectivo tambien
                  this.pfdcFlag = true;//Se activa esta bandera, en el html de ser true la tabla que cargan los productos fuera del catalogo puede ser visible
                });
            } else {//De ser false, implica que los productos de la solicitud son completamente dentro del catálogo de productos
              this.pfdcFlag = false;//La bandera se pone false implicando que no se muestre la tabla de productos fuera del catalogo
            }
          });
        this.detalleCompraService.getDetallesCompra(id).subscribe(//Se obtienen los detalles de la compra mediante el id_compra, los productos y las cantidades solicitadas, autorizada y compradas
          deta_compra => {
            this.dataSource = new MatTableDataSource(deta_compra);//Se cargan los datos a su tabla
            this.detalles_compra = deta_compra;//se cargan los datos tambien a su respectivo array
          });
      }
    });
  }

  //Método mediante el cual se guarda el ticket y se válida el mismo
  subirTicket(event) {
    this.ticket = event.target.files[0];//Se guarda el archivo en el objeto ticket
    if (this.ticket.type.indexOf('pdf') < 0 && this.ticket.type.indexOf('image') < 0) {//Se válida inicialmente si es formato pdf o de tipo imagen(Unicos tipps de archivos permitidos)
      swal.fire('Error seleccionar un formato válido: ', 'El archivo debe ser del tipo imagen o pdf', 'error');//De no cumplirse el formato requerido se lanza error indicandole al usuario
      this.ticket = null;//Y el objeto se queda en null para que el usuario pueda volver a seleccionar
    }
    if (this.ticket) {//A este punto de ser un formato válido
      this.mensajet = this.ticket.name;//se guarda el nombre del archivo para mostrarlo en la vista
    } else {
      this.mensajet = "Ticket no seleccionado*";//De lo contrario seguir indicando que el archivo sigue sin seleccionarse
    }
  }

  //Para el caso en el que el estatus de que la compra sea pendiente, y se regitre la compra, en este método se validan los input donde se especifica cuanta cantidad de X producto se compró
  validarDetalles(): boolean {
    let bandera = false;//Bandera que devolera este metodo, de ser true quiere decir que hay error en el fomulario, de lo contrario no hay error
    this.detalles_compra = this.dataSource.data;//Los datos de los input se guardan en la tabla, por lo que aquí se actualizan los array de los detalles con la informacion proporcionada por el usuario
    this.detalles_compra_PFDC = this.dataSource2.data;//Aplica para el caso de los productos fuera del catalogo, recordemos que tiene su tabla aparte
    for (this.detalle_compra of this.detalles_compra) {//Se recorren inicialmente los productos dentro del catalogo
      if (this.detalle_compra.cant_comprada == null || this.detalle_compra.cant_comprada < 1 || this.detalle_compra.cant_comprada > this.maxStock) {//La cantidad comprada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
        bandera = true;//De haber una coincidencia, implica error y la bandera se vuelve true
      }
    }

    for (this.detalle_compra_PFDC of this.detalles_compra_PFDC) {//Se recorren los productos fuera del catalogo
      if (this.detalle_compra_PFDC.cant_comprada == null || this.detalle_compra_PFDC.cant_comprada < 1 || this.detalle_compra_PFDC.cant_comprada > this.maxStock) {//La cantidad comprada no puede ser nula, no puede un numero menor que 1 ni mayor que el maximo permitido en stock
        bandera = true;//De haber una coincidencia, implica error y la bandera se vuelve true
      }
    }

    return bandera;//Se retorna el resultado, de ser true implica error, de ser false significa que el formulario esta correcto
  }

  //Método mediante el cual se guarda la compra
  guardarCompra() {
    if (this.validarDetalles()) {//Se valida que no exista errores en los input de cantidad comprada
      swal.fire('Para guardar la compra debe de ingresar un valor diferente de cero o válido en la cantidad comprada', '', 'info');//Mensaje de error
    } else {
      if (this.ticket && this.compra.gasto_total && this.compra.fecha_creacion && this.compra.gasto_total>0) {//Se válida que todos los campos requeridos estén rellenados
        swal.fire({
          title: '¿Desea guardar esta compra? ',//Se consulta al usuario antes de continuar
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.compra.estatus = "Completada";//Al guardar la compra el estatus cambia a completada
            this.compra.usuario = JSON.parse(localStorage.getItem('nombreCUsuario')!);//Se obtiene el nombre de usuario que ingresó al sistema para registrarlo como aquel que registro la compra
            //this.detalles_compra = this.dataSource.data;
            this.comprasService.update(this.compra).subscribe(
              compra => {//Se actualiza la compra en la base ded atos
                this.comprasService.cargarTicket(this.ticket, compra.id_compra).
                  subscribe(compra => {//Se carga el ticket a la compra
                    if (compra.solicitud.pfdc === true) {//Se evalua si existen productos fuera del catalogo
                      this.detalles_compra_PFDC = this.dataSource2.data;//Se obtienen los datos de la tabla
                      this.detalleCompraPFDCService.update(this.detalles_compra_PFDC, compra.id_compra).subscribe(detas_pfdc => { });//Se actualizan los detalles en la base de datos
                    }
                  });
                this.detalleCompraService.update(this.detalles_compra, compra.id_compra).subscribe(
                  detalles => {//Se actualizan los detalles de compra con los productos del catalogo en la base de datos
                    if (detalles) {//Si la actualizacion se efectuó correctamente
                      this.crearActualizarInventario(detalles);//En este metodo se crea o se actualiza el inventario de la sucursal de la compra
                      swal.fire(
                        'Mensaje',
                        `La compra:  ${compra.id_compra} fue guardada con éxito`, //Mensaje de que la compra se guardo exitosamente
                        'success'
                      );
                      this.router.navigate(['/layout/compras']);//Se redirecciona a donde estan todas las compras
                    } else {
                      swal.fire(
                        'Mensaje',
                        `Error guardar la compra`,//Mensaje de error en caso de haberlo
                        'error'
                      );
                    }
                  });
              });
          } else if (result.isDenied) {
            swal.fire('La compra no fue guardada', '', 'info');//Si el usuario decide no proceder aparece este mensaje
          }
        }
        );
      } else {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Rellene los campos necesarios para continuar'//Mensaje que indica al usuario que rellene los campos requeridos
        })
      }
    }
  }

  //En caso de que la compra este "Completada" se accede a este método en donde el ticket perteneciente a la compra se puede descargar
  descargarTicket() {
    var nombreArchivo = this.compra.ticket;//Se obtiene el nombre del ticket
    window.open("http://localhost:8080/api/compras/show/archivo/" + nombreArchivo);//Mediatne a la ruta establecida en el backend + el nombre del archivo se abre una nueva venta para descargar el archivo
  }

  //En este metodo se crea o se actualiza el inventario de la secursal
  crearActualizarInventario(detalles_c: Detalle_compra[]) {
    var deta_compra = new Detalle_compra()//Se crea una variable para el detalle compra
    this.inventarioService.getInventarioBySucursal(this.compra.id_sucursal).subscribe(
      inventarioConsulta => {//Se consulta a la base de datos si existe un inventario de la sucursal
        if (inventarioConsulta === null) {//En caso de que aún no exista un inventario de la sucursal en curso
          var deta_invent = new Detalle_inventario();//Se declara un objeto detalle inventario
          var invent = new Inventario();//Se declara un objeto inventario
          invent.nombre_sucursal = this.compra.nombre_sucursal; //al inventario se ingresa el nombre de la sucursal
          invent.id_sucursal = this.compra.id_sucursal;//Se ingresa tambien el id de la sucursal
          invent.fecha_ultima_actualizacion = new Date(); //Se establece la fecha de actualizacion
          this.inventarioService.create(invent).subscribe(
            inventarionuevo => {//Se crea/registra el inventario en la base de datos
              for (deta_compra of detalles_c) { //Se recorre los detalles de compra que pide como parametro este metodo
                deta_invent.inventario = inventarionuevo; //Se asigna el inventario recien creado
                deta_invent.producto = deta_compra.producto; //Se agrega el producto de la compra
                deta_invent.cant_existente = deta_compra.cant_existente + deta_compra.cant_comprada;//la cantidad que se compro mas la cantidad que se solicitó en un principio = a la cantidad actual del producto
                deta_invent.fecha_ultima_actualizacion = new Date();//Se establece la fecha de actualizacion
                this.detaInventarioService.create(deta_invent).subscribe(
                  deta_i => {//Se crea cada detalle del inventario conforme se recorre el for
                    console.log("done " + deta_i.producto.descripcion + " " + deta_i.inventario.id_inventario);
                  });
              }
            });
        } else {
          //"Si hay inventario"
          inventarioConsulta.fecha_ultima_actualizacion = new Date();//Se establece la fecha de actualizacion
          this.inventarioService.update(inventarioConsulta).subscribe(
            inventarioActualizado => {//Se actualiza el inventario
              var deta_i = new Detalle_inventario();
              deta_i.inventario = inventarioActualizado;
              for (deta_compra of detalles_c) {//Se recorren los detalles que se pide como parametro
                deta_i.producto = deta_compra.producto;//Se registra el producto
                deta_i.fecha_ultima_actualizacion = new Date();//Se actualiza la fecha
                deta_i.cant_existente = deta_compra.cant_existente + deta_compra.cant_comprada;//Se registra la cantidad existente del producto
                this.detaInventarioService.create(deta_i).subscribe(
                  det => {//Se crea/actualiza los detalles del inventario conforme se recorre el for
                    console.log("actualizado/creado");
                  });
              }
            });
        }
      });
  }

  //Método para poder visualizar un pdf, abriendo un Dialog(Componente de Angular Material)
  openDialog() {
    var ubicacionArchivo = "http://localhost:8080/api/compras/show/archivo/" + this.compra.ticket;//Se establece la ruta del ticket de la compra
    this.dialog.open(TicketViewComponent, {//Se abre un nuevo dialogo
      width: "1000px",//Se establece el tamaño del componente
      data: {
        ticket: ubicacionArchivo,//Se pasa como parametro la ubicacion del archivo
      },
    });
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos de la sucursal
  donde se esta logeando y se almacenan dichas configuraciones en variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal() {
    var nombreSucursal = JSON.parse(localStorage.getItem('sucursalIngresa')!);
    this.maxMinStockService.getMaxMinDeStockBySucursal(nombreSucursal).subscribe(
      maxMinStockSucursal => {
        if (maxMinStockSucursal === null) {
          this.maxStock = 50;
          this.minStock = 5;
        } else {
          this.maxStock = maxMinStockSucursal.max_stock;
          this.minStock = maxMinStockSucursal.min_stock;
        }
      });

    this.maxMinExistenciaService.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(
      maxMinExistenciaSucursal => {
        if (maxMinExistenciaSucursal === null) {
          this.maxExistencia = 50;
          this.minExistencia = 5;
        } else {
          this.maxExistencia = maxMinExistenciaSucursal.max_existencia;
          this.minExistencia = maxMinExistenciaSucursal.min_existencia;
        }
      });
  }
}
