import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../administracion/servicios/papeleria/compras.service';
import { Detalle_compra } from '../../administracion/modelos/papeleria/detalle_compra';
import { DetalleCompraService } from '../../administracion/servicios/papeleria/detalle-compra.service';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService } from 'src/app/administracion/servicios';
import swal from 'sweetalert2';

@Component({
  selector: 'app-compras-adquisiciones',
  templateUrl: './compras-adquisiciones.component.html',
  styleUrls: ['./compras-adquisiciones.component.scss']
})
export class ComprasAdquisicionesComponent implements OnInit {
  sucursales: Sucursal[];//Arreglo de sucursales
  sucursal = new Sucursal();//Objeto sucursal
  compra = new Compra();//Objeto compra
  compras: Compra[];//Arreglo de compras
  comprasSuc: Compra[];//Arreglo de compras de una sucursal
  detalle_compra: Detalle_compra;//Objeto Detalle de compra
  enProceso: Compra[];//Arreglo para las compras en proceso
  completadas: Compra[];////Arreglo para las compras completadas
  displayedColumns: string[] = ['id_compra', 'fecha_compra', 'usuario', 'sucursal', 'action'];//Encabezados para los titulos de las columnas de la tabla
  dataSource1 = new MatTableDataSource();//Tabla para compras en proceso
  dataSource2 = new MatTableDataSource();//Tbabla para compras completadas
  dataSource3 = new MatTableDataSource();//Tabla para mostrar todas las compras
  dataSource4 = new MatTableDataSource();//Tabla para mostrar compras de un sucursal
  BanderaMostrar: Boolean;//Bandera para mostrar o no el área de compras de sucursal
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema


  constructor(private sucursalService: SucursalService,
              private comprasService: ComprasService,
              private detalleCompraService: DetalleCompraService) { }


  ngOnInit(): void
  {
    this.error = false;
    //Se obtienen las sucursales para poder realizar filtros de coompras de acuerdo a una sucursal
    this.sucursalService.getSucursales().subscribe(val => {
      this.sucursales = val;
    },(err) => {
      //En caso de error muestra el mensaje de alerta de la sección
      this.error = true;
    });

    //Se obtienen todas las compras disponibles y se separan en completadas y enProceso
    this.comprasService.getCompras().subscribe(
      compras => {
        this.compras = compras;
        this.completadas = this.filtrarCompletadas(compras);
        this.enProceso = this.filtrarEnProceso(compras);
        this.dataSource1 = new MatTableDataSource(this.enProceso);
        this.dataSource2= new MatTableDataSource(this.completadas);
        this.dataSource3 = new MatTableDataSource(this.compras);
      },(err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
      });
      this.BanderaMostrar = false;
  }

  //Se filtra la lista general de compras para obtener solo las de estatus completada
  filtrarCompletadas(compras: Compra[]): Compra[] {
    const completadas = compras.filter(compra => compra.estatus === "Completada");
    return completadas;
  }

  //Se filtra la lista general de compras para obtener solo las de estatus en Proceso
  filtrarEnProceso(enProceso: Compra[]): Compra[] {
    const EnProces = enProceso.filter(compra => compra.estatus === "En proceso");
    return EnProces;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
  }

  //Método para obtener las compras de una sucursal elegida por el usuario
  cargarCompraSucursal()
  {
    //Se inicializa el spinner
    this.banderaCarga = true;
    //se valida la sucursal elegida por el usuario
    if (this.sucursal.idSucursal)
    {
      //Se obtienen las compras de sucursal
      this.comprasService.getCompraBySucursal(this.sucursal.idSucursal).subscribe(
        compras => {
          //Se almacenan en su respectivo arreglo
          this.comprasSuc = compras;

          if (compras.length==0) {//Si no se obtienen compras de esa consulta
            //Implica que no existen compras para esa sucursal
            this.BanderaMostrar = false;
            //Se deja en blanco el select
            this.sucursal = new Sucursal();
            //Y se manda un mensaje al usuario
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'No se encontró compras de esa sucursal',
            });
            //Se detiene el spinner
            this.banderaCarga = false;
          }else{
            //En caso de obtener compras de esa sucursal se cargan a la Tabla
            //y la bandera para activar el área de esas compras se activa
            this.BanderaMostrar = true;
            this.dataSource4 = new MatTableDataSource(compras);
            //Se detiene el spinner
            this.banderaCarga = false;
          }
          },(err) => {
            //En caso de error muestra el mensaje de alerta de la sección
            this.error = true;
            //Se detiene el spinner
            this.banderaCarga = false;
            swal.fire('Error',`Error al cargar las compras`,'error');
          });
    }else{
      //Se detiene el spinner
      this.banderaCarga = false;
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Seleccione alguna sucursal para continuar',
      });
    }
  }

}
