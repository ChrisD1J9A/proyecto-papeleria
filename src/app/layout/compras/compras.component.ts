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
  compra = new Compra();
  compras: Compra[];
  displayedColumns: string[] = ['id_compra', 'fecha_compra', 'gasto_total', 'estatus', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private comprasService: ComprasService) { }

  ngOnInit(): void {
    this.comprasService.getCompras().subscribe(
      compras => {
        this.compras = compras;
        this.dataSource = new MatTableDataSource(this.compras);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
