import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/administracion/modelos/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import swal from 'sweetalert2';

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
  dataSource2 = new MatTableDataSource();// tabla para el resultado de los reportes de la sumatoria de el gasto total que tuvieron cada sucursal
  dataSource3 = new MatTableDataSource();//tabla que almacena las compras por  rangos de tiempo
  displayedColumns: string[] = ['id_compra', 'sucursal', 'fecha', 'maximo'];//El titulo para cada columna de la tabla de los maximos gastos efectuados en cada sucursal
  displayedColumns2: string[] = ['sucursal', 'total'];
  meses: number;//Variable que almacena la consulta deseada por el usuario, seleccionada en un select
  flagDatePicker: boolean; //Variable que se manipula con un check box, para activar un datepicker
  flagDatePicker2: boolean; //Variable que se manipula con un check box, para activar un datepicker
  flagDatePicker3: boolean; //Variable que se manipula con un check box, para activar un datepicker
  date: Date; //Variable para establecer en el datePicker que la fecha maxima a poder elegir sea la actual
  fechaR1: Date;//Variable para almacenar el rango de fecha inicial en el datePicker
  fechaR2: Date;//Variable para almacenar el rango de fecha final en el datePicker
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private compraService: ComprasService) { }

  ngOnInit(): void {
    this.flagDatePicker = false;
    this.flagDatePicker2 = false;
    this.flagDatePicker3 = false;
    this.error = false;
    this.date = new Date();
  }

  //Metodo para buscar datos especificos en la tabla de maximos gastos efectuados en cada sucursal
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  //Cargar los datos a la tabla de acuardo a la elección del usuario en el select o el datepicker
  //y despues de  presonar el boton de buscar
  cargarGastosMaxPorSucursal() {
    //Cuando esta bandera esta en false significa que el usuario usó el select y se toma en cuenta el rango de tiempo selecciondo (meses)
    if (this.flagDatePicker == false) {
      //Se realiza la consulta en la bd, meses obtiene su valor en un select
      this.compraService.gastoMaxPorSucursales(this.meses).subscribe(
        datos => {
          this.error = false;
          //Los datos obtenidos se proyectan en la tabla y en este apartado se cargan dichos datos
          this.dataSource = new MatTableDataSource(datos);
          if (datos.length == 0) { //En caso de que la consulta no genere ningun dato
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');//Mandar mensaje de que no se encuentran datos
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success'); //Mensasje de obtención de datos exitoso
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    } else {//En caso contrario, en el que la bandera sea true, quiere decir que el usuario  uso el date picker
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d1 = this.fechaR1.getFullYear() + "-" + (this.fechaR1.getMonth() + 1) + "-" + this.fechaR1.getDate();
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d2 = this.fechaR2.getFullYear() + "-" + (this.fechaR2.getMonth() + 1) + "-" + this.fechaR2.getDate();
      //Se realiza la consulta  de acuerdo a un rango de fechas obtenidos en el datePicker
      this.compraService.gastoMaxPorSucursalesRangos(d1, d2).subscribe(
        datos => {
          this.error = false;
          this.dataSource = new MatTableDataSource(datos);//Los datos obtenidos se cargan a la tabla
          if (datos.length == 0) { //Si la consulta no devuelve dato alguno
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');//Mensaje de que la consulta no devolvió datos
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    }
  }

  //Mayores gastos de las sucursales desde siempre
  gastosMaximosHistorico(){
    this.compraService.gastoMaxPorSucursalesHistorico().subscribe(
      datos => {
        this.error = false;
        //Los datos obtenidos se cargan a la tabla
        this.dataSource = new MatTableDataSource(datos);
        if (datos.length == 0) { //Si la consulta no devuelve dato alguno
          //Mensaje de que la consulta no devolvió datos
          swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');
        }else{
          swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
        }
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
        //Mensaje relacionado con el error
        swal.fire('Error',`Error al cargar los datos`,'error');
      });
  }

  //Metodo para obtener la sumatoria de los gastos de cada sucursal en un periodo de tiempo
  cargarGastosTotalesDeLasSucursales()
  {
    //Cuando esta bandera esta en false significa que el usuario usó el select y se toma en cuenta el rango de tiempo selecciondo (meses)
    if (this.flagDatePicker2 == false) {
      //Se realiza la consulta en la bd, meses obtiene su valor en un select
      this.compraService.gastoTotalPorSucursales(this.meses).subscribe(
        datos => {
          this.error = false;
          //Los datos obtenidos se proyectan en la tabla y en este apartado se cargan dichos datos
          this.dataSource2 = new MatTableDataSource(datos);
          if (datos.length == 0) { //En caso de que la consulta no genere ningun dato
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');//Mandar mensaje de que no se encuentran datos
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success'); //Mensasje de obtención de datos exitoso
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    } else {//En caso contrario, en el que la bandera sea true, quiere decir que el usuario  uso el date picker
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d1 = this.fechaR1.getFullYear() + "-" + (this.fechaR1.getMonth() + 1) + "-" + this.fechaR1.getDate();
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d2 = this.fechaR2.getFullYear() + "-" + (this.fechaR2.getMonth() + 1) + "-" + this.fechaR2.getDate();
      //Se realiza la consulta  de acuerdo a un rango de fechas obtenidos en el datePicker
      this.compraService.gastoTotalPorSucursalesRangos(d1, d2).subscribe(
        datos => {
          this.error = false;
          this.dataSource2 = new MatTableDataSource(datos);//Los datos obtenidos se cargan a la tabla
          if (datos.length == 0) { //Si la consulta no devuelve dato alguno
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');//Mensaje de que la consulta no devolvió datos
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    }
  }

  //Metodo para obtener la sumatoria de los gastos de cada sucursal historicamente
  gastosTotalessHistorico(){
    this.compraService.gastoTotalPorSucursalesHistorico().subscribe(
      datos => {
        this.error = false;
        this.dataSource2 = new MatTableDataSource(datos);//Los datos obtenidos se cargan a la tabla
        if (datos.length == 0) { //Si la consulta no devuelve dato alguno
          //Mensaje de que la consulta no devolvió datos
          swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');
        }else{
          swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
        }
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
        //Mensaje relacionado con el error
        swal.fire('Error',`Error al cargar los datos`,'error');
      });
  }

  //Método para cargar compras almacenadas de acuerdo a un periodo de tiempo
  cargarComprasPorTiempo()
  {
    //Cuando esta bandera esta en false significa que el usuario usó el select y se toma en cuenta el rango de tiempo selecciondo (meses)
    if (this.flagDatePicker3 == false) {
      this.compraService.getComprasPorTiempo(this.meses).subscribe(//Se realiza la consulta en la bd, meses obtiene su valor en un select
        datos => {
          this.error = false;
          //Los datos obtenidos se proyectan en la tabla y en este apartado se cargan dichos datos
          this.dataSource3 = new MatTableDataSource(datos);
          if (datos.length == 0) { //En caso de que la consulta no genere ningun dato
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');//Mandar mensaje de que no se encuentran datos
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success'); //Mensasje de obtención de datos exitoso
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    } else {//En caso contrario, en el que la bandera sea true, quiere decir que el usuario  uso el date picker
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d1 = this.fechaR1.getFullYear() + "-" + (this.fechaR1.getMonth() + 1) + "-" + this.fechaR1.getDate();
      //Para realizar la consulta correctamente se le dio un formato de fecha
      var d2 = this.fechaR2.getFullYear() + "-" + (this.fechaR2.getMonth() + 1) + "-" + this.fechaR2.getDate();
      //Se realiza la consulta  de acuerdo a un rango de fechas obtenidos en el datePicker
      this.compraService.getComprasPorRangos(d1, d2).subscribe(
        datos => {
          this.error = false;
          console.log(datos);
          this.dataSource3 = new MatTableDataSource(datos);//Los datos obtenidos se cargan a la tabla
          if (datos.length == 0) { //Si la consulta no devuelve dato alguno
            //Mensaje de que la consulta no devolvió datos
            swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');
          }else{
            swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
          }
        },
        (err) => {
          //En caso de error muestra el mensaje de alerta de la sección
          this.error = true;
          //Mensaje relacionado con el error
          swal.fire('Error',`Error al cargar los datos`,'error');
        });
    }
  }

  //Método para obtener y cargar todas las compras de la base de datos
  cargarCompras()
  {
    this.compraService.getCompras().subscribe(
      datos => {
        this.error = false;
        //Los datos obtenidos se cargan a la tabla
        this.dataSource3 = new MatTableDataSource(datos);
        if (datos.length == 0) { //Si la consulta no devuelve dato alguno
          //Mensaje de que la consulta no devolvió datos
          swal.fire('Oops', 'No se encontraron datos en ese periodo de tiempo', 'info');
        }else{
          swal.fire('Ok', 'Datos obtenidos', 'success');//Mensaje de consulta exitosa
        }
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
        //Mensaje relacionado con el error
        swal.fire('Error',`Error al cargar los datos`,'error');
      });
  }
}
