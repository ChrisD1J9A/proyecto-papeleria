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


  constructor(private inventarioService: InventarioService,
              private detalleInvenarioService: DetalleInventarioService,
              private maxMinStockService: MaxMinStockService,
              private maxMinExistenciaService: MaxMinExistenciaService) { }

  ngOnInit(): void {
    this.cargarInventario();//Metodo mediante el cual se carga el inventario de la base de datos
  }


  //Metodo mediante el cual se carga el inventario de la base de datos
  cargarInventario() {
    var idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);//Se obtiene la id de la sucursal desde donde se inicio sesion
    this.inventarioService.getInventarioBySucursal(idSucursal).subscribe(
      inventario => {//Se busca un inventario acorde a su id en la base de datos
        this.inventario = inventario;//Se guarda en el objeto inventario
        this.obtenerMaximosMinimosDeLaSucursal(inventario);//Se obtienen los maximos y menimos de la sucursal de ese inventario
        if (this.inventario) {//Si existe inventario para la actual sucursal
          this.detalleInvenarioService.getDetallesInventario(inventario.id_inventario).subscribe(
            detas => {//Se buscan los detalles del inventario de acuerdo al id_inventario
              this.dataSource = new MatTableDataSource(detas);//Se carga a la tabla
              this.inventarioBajo = detas.filter(invent => invent.cant_existente <= this.minStock);//Se hace un filtro para mostrar productos con stock bajo
              this.dataSource2 = new MatTableDataSource(this.inventarioBajo);//Se carga a la tabla el inventario bajo
              //console.log(this.inventarioBajo);
            });
        }
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
