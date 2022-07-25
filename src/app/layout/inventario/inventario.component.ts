import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Inventario } from '../../administracion/modelos/papeleria/inventario';
import { Detalle_inventario } from '../../administracion/modelos/papeleria/detalle_inventario';
import { InventarioService } from '../../administracion/servicios/papeleria/inventario.service';
import { DetalleInventarioService } from '../../administracion/servicios/papeleria/detalle-inventario.service';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/administracion/modelos/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import  swal from 'sweetalert2';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class InventarioComponent implements OnInit {
  inventario = new Inventario();//Objeto inventario
  detalle_inventario = new Detalle_inventario();//Objeto detalle inventario
  detas: Detalle_inventario[] = null;
  inventarioBajo = new Array();//Arreglo para almacenar productos con stock bajo
  displayedColumns: string[] = ['id_producto', 'unidad', 'descripcion', 'cant_existente'];//Encabezados para las columnas de la tabla de detalle inventario
  dataSource = new MatTableDataSource(this.detas);//Tabla para los detalle_inventario
  dataSource2 = new MatTableDataSource();//Tabla para los productos con stock bajo
  maxStock: number; //configuracion de maximo de stock
  minStock: number; //configuracion del minimo de stock
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema


  constructor(private inventarioService: InventarioService,
              private detalleInvenarioService: DetalleInventarioService,
              private maxMinStockService: MaxMinStockService,
              private maxMinExistenciaService: MaxMinExistenciaService) { }

  ngOnInit(): void {
    this.error = false;
    this.cargarInventario();//Metodo mediante el cual se carga el inventario de la base de datos
  }


  //Metodo mediante el cual se carga el inventario de la base de datos
  cargarInventario() {
    //Se obtiene la id de la sucursal desde donde se inicio sesion
    var idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);
    this.inventarioService.getInventarioBySucursal(idSucursal).subscribe(
      inventario => {//Se busca un inventario acorde a su id en la base de datos
        this.inventario = inventario;//Se guarda en el objeto inventario
        //Se obtienen los maximos y menimos de la sucursal de ese inventario
        this.obtenerMaximosMinimosDeLaSucursal(inventario);
        if (this.inventario) {//Si existe inventario para la actual sucursal
          this.detalleInvenarioService.getDetallesInventario(inventario.id_inventario).subscribe(
            detas => {//Se buscan los detalles del inventario de acuerdo al id_inventario
              this.dataSource = new MatTableDataSource(detas);//Se carga a la tabla
              //Se hace un filtro para mostrar productos con stock bajo
              this.inventarioBajo = detas.filter(invent => invent.cant_existente <= this.minStock);
              //Se carga a la tabla el inventario bajo
              this.dataSource2 = new MatTableDataSource(this.inventarioBajo);
              //console.log(this.inventarioBajo);
            });
        }
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
        //Mensaje relacionado con el error
        swal.fire('Error',`Error al cargar el inventario`,'error');
      });
  }

  /*Método que sirve para obtener la configuracion de maximos y minimos
  de la sucursal y se almacenan dichas configuraciones en el variables
  En dado caso de no existir una configuracion para la sucursal se colocarán valores por default*/
  obtenerMaximosMinimosDeLaSucursal(inventario: Inventario)
  {
    var nombreSucursal:string = inventario.nombre_sucursal;
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
  }

}
