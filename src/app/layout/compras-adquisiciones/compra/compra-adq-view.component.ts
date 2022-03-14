import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Solicitud } from '../../../administracion/modelos/papeleria/solicitud'
import { Compra } from '../../../administracion/modelos/papeleria/compra';
import { ComprasService } from '../../../administracion/servicios/papeleria/compras.service';
import { Detalle_compra } from '../../../administracion/modelos/papeleria/detalle_compra';
import { DetalleCompraService } from '../../../administracion/servicios/papeleria/detalle-compra.service';
import { Proveedor } from '../../../administracion/modelos/papeleria/proveedor';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  ticket: string;
}

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
  solicitud = new Solicitud();
  bandera : Boolean;

  constructor(private compraService: ComprasService,
    private detalleCompraService: DetalleCompraService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }

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
            this.solicitud = compra.solicitud;
            if (compra.gasto_total % 1 == 0) {
                this.bandera =  true;
                console.log(this.bandera);
            } else {
                this.bandera = false;
                console.log(this.bandera);
            }
          });
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

  openDialog() {
    var ubicacionArchivo = "http://localhost:8080/api/compras/show/archivo/" + this.compra.ticket;
    this.dialog.open(PdfTicket, {
      width: "1000px",
      data: {
        ticket: ubicacionArchivo,
      },
    });
  }
}


@Component({
  selector: 'pdf-ticket',
  templateUrl: 'pdf-ticket.html',
})
export class PdfTicket{
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){
    console.log(data.ticket)
  }
}
