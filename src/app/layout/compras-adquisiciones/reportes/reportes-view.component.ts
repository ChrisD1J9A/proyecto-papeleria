import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/administracion/modelos/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-reportes-view',
  templateUrl: './reportes-view.component.html',
  styleUrls: ['./reportes-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ReportesViewComponent implements OnInit {
  dataSource = new MatTableDataSource(); // tabla para el resultado de los reportes de maximos gastos efectuados en cada sucursal
  displayedColumns: string[] = ['id_compra', 'sucursal', 'fecha', 'maximo'];//El titulo para cada columna de la tabla de los maximos gastos efectuados en cada sucursal
  meses: number;//Variable que almacena la consulta deseada por el usuario, seleccionada en un select
  flagDatePicker: boolean; //Variable que se manipula con un check box, para activar un datepicker
  date: Date;
  fechaR1: Date;
  fechaR2: Date;

  constructor(private compraService: ComprasService) { }

  ngOnInit(): void {
    this.flagDatePicker = false;
    this.date = new Date();
  }

//Metodo para buscar datos especificos en la tabla de maximos gastos efectuados en cada sucursal
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

//Cargar los datos a la tabla de acuardo a la elección del usuario en el select
  cargarGastosMaxPorSucursal() {
    /*this.compraService.gastoMaxPorSucursal(this.meses).subscribe( //Se realiza la consulta en la bd, meses obtiene su valor en un select
      datos => {
        console.log(datos);
        this.dataSource = new MatTableDataSource(datos); //Los datos obtenidos se proyectan en la tabla y en este apartado se cargan dichos datos
      });*/

      if(this.flagDatePicker){
        var d1 = this.fechaR1.getFullYear() +"-"+ (this.fechaR1.getMonth()+1) +"-" + this.fechaR1.getDate();
        var d2 = this.fechaR2.getFullYear() +"-"+ (this.fechaR2.getMonth()+1) +"-" + this.fechaR2.getDate();
      this.compraService.gastoMaxPorSucursalRangos(d1, d2).subscribe(
        datos =>{
          console.log(datos);
        })
        console.log(d1);
        console.log(d2);
      }
    /*this.compraService.gastoMaxPorSucursalHistorico().subscribe(
      datos => {
        console.log(datos);
      });*/

    /*this.compraService.gastoTotalPorSucursal(6).subscribe(
      datos => {
        console.log(datos);
      });

    this.compraService.gastoTotalPorSucursalHistorico().subscribe(
      datos => {
        console.log(datos);
      });*/
  }
}

  /*cargarGastosMaxPorSucursalRangos()
  {
    this.compraService.gastoMaxPorSucursalRangos(this.fechaR1, this.fechaR2).subscribe(
      datos =>{
        console.log(datos);
      });
  }*/
