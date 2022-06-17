import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../administracion/servicios/papeleria/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  compra = new Compra();//Objeto compra
  compras: Compra[];//Areglo para almacenar las compras
  displayedColumns: string[] = ['id_compra', 'solicitud', 'fecha_compra', 'gasto_total', 'estatus', 'action']; //Encabezados para las columnas de la tabla de compras
  dataSource = new MatTableDataSource();//Para la tabla que muestre las compras de la base de datos
  idSucursal = JSON.parse(localStorage.getItem('idSucursal')!);//Obtenemos la sucursal desde la cual se ingresó
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema

  constructor(private comprasService: ComprasService) { }

  ngOnInit(): void {
    this.error = false;
    this.comprasService.getCompraBySucursal(this.idSucursal).subscribe(//Se buscan las compras pertenecientes a la sucursal desde donde se ingresa al iniciar sesion
      compras => {
        this.compras = compras;//Las compras se cargan al arreglo
        this.dataSource = new MatTableDataSource(this.compras);//tambien se cargan a la tabla
      },(err) => {
        //En caso de error muestra el mensaje de alerta de la sección
        this.error = true;
      });
  }

  //Metodo para filtrar o buscar datos especificos de la tabla de compras
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
