import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';

@Component({
  selector: 'app-reportes-view',
  templateUrl: './reportes-view.component.html',
  styleUrls: ['./reportes-view.component.scss']
})
export class ReportesViewComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id_compra', 'sucursal', 'fecha', 'maximo'];
  meses: number;
  constructor(private compraService: ComprasService) { }

  ngOnInit(): void {
    this.cargarGastosMaxPorSucursal();
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarGastosMaxPorSucursal() {
    this.compraService.gastoMaxPorSucursal(6).subscribe(
      datos => {
        console.log(datos);
      });

    this.compraService.gastoMaxPorSucursalHistorico().subscribe(
      datos => {
        console.log(datos);
      });

    this.compraService.gastoTotalPorSucursal(6).subscribe(
      datos => {
        console.log(datos);
      });

    this.compraService.gastoTotalPorSucursalHistorico().subscribe(
      datos => {
        console.log(datos);
      });
  }
}
