import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from '../../../administracion/modelos/compra';
import { ComprasService } from '../../../administracion/servicios/compras.service';
import { Detalle_compra } from '../../../administracion/modelos/detalle_compra';
import { DetalleCompraService } from '../../../administracion/servicios/detalle-compra.service';
import { Proveedor } from '../../catalogo/proveedores/proveedor';

@Component({
  selector: 'app-compra-adq-view',
  templateUrl: './compra-adq-view.component.html',
  styleUrls: ['./compra-adq-view.component.scss']
})
export class CompraAdqViewComponent implements OnInit {
  compra = new Compra();
  proveedor = new Proveedor();
  compras: Compra[];
  detalles_compra: Detalle_compra[];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['tipo_unidad', 'descripcion_producto', 'cant_existente', 'cant_solicitada', 'cant_autorizada', 'cant_comprada'];
  banderaEditar: Boolean;
  nombreProveedor: String;

  constructor(private compraService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarSolicitud();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarSolicitud(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.compraService.getCompra(id).subscribe(
          (compra) => {
            this.compra = compra;
            this.proveedor = this.compra.proveedor;
            if (this.proveedor) {
              this.nombreProveedor = this.proveedor.nombre;
            } else {
              this.nombreProveedor = "";
            }
            console.log(this.proveedor);
            if (compra.estatus == 'Completada') {
              this.banderaEditar = false;
            } else {
              this.banderaEditar = true;
            }
          }
        )
        this.detalleCompraService.getDetallesCompra(id).subscribe(
          deta_compras => {
            this.dataSource = new MatTableDataSource(deta_compras);
            console.log(id);
          });
      }
    })
  }

  descargarTicket() {
    var nombreArchivo = this.compra.ticket;
    console.log(nombreArchivo);
    window.open("http://localhost:8080/api/compras/show/archivo/" + nombreArchivo);
  }

}
