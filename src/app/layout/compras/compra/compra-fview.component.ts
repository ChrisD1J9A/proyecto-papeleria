import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Compra } from '../../../administracion/modelos/compra';
import { Detalle_compra } from '../../../administracion/modelos/detalle_compra';
import { Proveedor } from '../../catalogo/proveedores/proveedor';
import { ComprasService } from '../../../administracion/servicios/compras.service';
import { DetalleCompraService } from '../../../administracion/servicios/detalle-compra.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-compra-fview',
  templateUrl: './compra-fview.component.html',
  styleUrls: ['./compra-fview.component.scss']
})
export class CompraFViewComponent implements OnInit {
  compra = new Compra();
  detalle_compra = new Detalle_compra();
  detalles_compra: Detalle_compra[];
  proveedor = new Proveedor();
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada', 'cant_final'];
  dataSource = new MatTableDataSource();

  constructor(private comprasService: ComprasService, private detalleCompraService: DetalleCompraService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCompra();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarCompra(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.comprasService.getCompra(id).subscribe(
          (compra) =>{
          this.compra = compra
          this.proveedor =  this.compra.proveedor;
          console.log(this.compra);
        })
        this.detalleCompraService.getDetallesCompra(id).subscribe(
          deta_compra => {
            this.dataSource = new MatTableDataSource(deta_compra);
            console.log(deta_compra);
          });
      }
    })
  }


}
