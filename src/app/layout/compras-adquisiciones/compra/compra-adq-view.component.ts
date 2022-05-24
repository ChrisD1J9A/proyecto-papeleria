import { Component, OnInit} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud'
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { Detalle_compra_PFDC } from '../../../administracion/modelos/papeleria/detalle_compra_PFDC';
import { DetalleCompraPFDCService } from '../../../administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { Proveedor } from '../../../administracion/modelos/papeleria/proveedor';
import { TicketViewComponent } from './ticket/ticket-view.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-compra-adq-view',
  templateUrl: './compra-adq-view.component.html',
  styleUrls: ['./compra-adq-view.component.scss']
})
export class CompraAdqViewComponent implements OnInit {
  compra = new Compra();//Objeto compra
  proveedor = new Proveedor();//Objeto proveedor
  compras: Compra[];//Arreglo de compras
  detalles_compra: Detalle_compra[];//Arreglo de detalles de compra
  detalle_compra_PFDC = new Detalle_compra_PFDC();//Objeto de detales de compra con productos fuera del catalogo
  detalles_compra_PFDC = new Array();//Arreglo de detales de compra con productos fuera del catalogo
  dataSource = new MatTableDataSource();//Tabla para los detalles de la compra
  dataSource2 = new MatTableDataSource();//Tabla para los detalles de la compra con productos fuera del catalogo
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada'];//Encabezados para las columnas de los detalles de compra
  banderaEditar: Boolean;//Bandera que determina si se muestran determinados datos en la vista
  nombreProveedor: String;//Variable para almacenar el nombre del proveedor
  solicitud = new Solicitud();//Objeto solicitud
  enlaceTicket = "http://localhost:8080/api/compras/show/archivo/";//Enlace al back del tick, solo hace falta indicar el nombre del ticket
  pfdcFlag: boolean;//Bandera que se activa si hay productosfuera del catalogo en la compra
  precioFormateado: string; //variable que se usa para dar formato de pesos en el input gasto total

  constructor(private compraService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private activatedRoute: ActivatedRoute,
    private detalleCompraPFDCService: DetalleCompraPFDCService,
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarCompra();//Metodo para cargar la compra desde la base de datos
  }

  //Metodo para cargar la compra desde la base de datos
  cargarCompra(): void {
    this.activatedRoute.params.subscribe(params => {//Se obtiene el id_compra de la ruta del navegador
      let id = params['id']//Se guarda el mencionado id
      if (id) {//Se valida que exista
        this.compraService.getCompra(id).subscribe(//Se obtiene la compra mediante su id
          (compra) => {
            this.compra = compra;//Se guarda la compra en el objeto compra
            //El gasto total que se registra lo pasamos a un string para darle formato de pesos
            this.precioFormateado = this.compra.gasto_total.toString();
            this.precioFormateado = this.currencyPipe.transform(this.precioFormateado, '$');//Se le da formato de pesos
            this.proveedor = this.compra.proveedor;// Se guarda el objeto proveedor en su respectivo objeto
            if (this.proveedor) {//Para evitar problemas internos se evalua la existencia del proveedor
              this.nombreProveedor = this.proveedor.nombre;
            } else {
              this.nombreProveedor = "";
            }
            if (compra.estatus == 'Completada') {//Dependiendo del estatus la compra se mostrará cierta informacion
              this.banderaEditar = false;
            } else {
              this.banderaEditar = true;
            }
            this.solicitud = compra.solicitud;//Se guarda o aisla el objeto soliciutd
            if(compra.solicitud.pfdc){//Se evalua si existen productos fuera del catalogo
              this.detalleCompraPFDCService.getDetallesCompra_PFDC(compra.id_compra).subscribe(
                detalles_ComprasPFDC => {//De existeir se buscan estos productos fuera del catalogo mediante el id_compra
                  //Se cargan los datos obtenidos a la base de datos
                  this.dataSource2 = new MatTableDataSource(detalles_ComprasPFDC);
                  //Se activa esta bandera para mostrar los productos fuera del catalogo en su propia tabla
                  this.pfdcFlag = true;
              });
            }else{
              this.pfdcFlag = false;//De no haber productos fuera del catalogo simplemente no se muestra su tabla
            }
          });
        this.detalleCompraService.getDetallesCompra(id).subscribe(
          deta_compras => {//Se buscan los detalles de la compra, partiendo de la id_compra
            this.dataSource = new MatTableDataSource(deta_compras);//Se guardan los resultados obtenidos en la tabla
          });
      }
    });
  }

  //Metodo para descargar el tickt
  descargarTicket() {
    var nombreArchivo = this.compra.ticket; //Se guarda el nombre del ticket de la compra
    //Se descarga el archivo accediendo a la ruta + el nombre del ticket
    window.open("http://localhost:8080/api/compras/show/archivo/" + nombreArchivo);
  }

  //Metodo para visualizar el ticket en un Dialog
  openDialog() {
    //Se establece la ruta para acceder al archivo en cuestion
    var ubicacionArchivo = "http://localhost:8080/api/compras/show/archivo/" + this.compra.ticket;
    this.dialog.open(TicketViewComponent, {//Se abre nuevo dialogo
      width: "1000px",
      data: {
        ticket: ubicacionArchivo,//Se carga la informacion del ticket
      },
    });
  }
}
