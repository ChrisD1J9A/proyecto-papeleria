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
  sucursales: Sucursal[];
  sucursal = new Sucursal();
  compra = new Compra();
  compras: Compra[];
  comprasSuc: Compra[];
  detalle_compra: Detalle_compra;
  enProceso: Compra[];
  completadas: Compra[];
  displayedColumns: string[] = ['id_compra', 'fecha_compra', 'usuario', 'sucursal', 'action'];
  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  dataSource4 = new MatTableDataSource();
  BanderaMostrar: Boolean;


  constructor(private sucursalService: SucursalService,
              private comprasService: ComprasService,
              private detalleCompraService: DetalleCompraService) { }

  ngOnInit(): void
  {
    this.sucursalService.getSucursales().subscribe(val => {
      this.sucursales = val;
    });

    this.comprasService.getCompras().subscribe(
      compras => {
        this.compras = compras;
        this.completadas = this.filtrarCompletadas(compras);
        this.enProceso = this.filtrarEnProceso(compras);
        this.dataSource1 = new MatTableDataSource(this.enProceso);
        this.dataSource2= new MatTableDataSource(this.completadas);
        this.dataSource3 = new MatTableDataSource(this.compras);
      })
      this.BanderaMostrar = false;
  }

  filtrarCompletadas(compras: Compra[]): Compra[] {
    const completadas = compras.filter(compra => compra.estatus === "Completada");
    return completadas;
  }

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

  cargarCompraSucursal()
  {
    if (this.sucursal.idSucursal)
    {
      this.comprasService.getCompraBySucursal(this.sucursal.idSucursal).subscribe(
        compras => {
          this.comprasSuc = compras;
          console.log(compras);
          if (compras.length==0) {
            this.BanderaMostrar = false;
            this.sucursal = new Sucursal();
            swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: 'No se encontró compras de esa sucursal',
            })
          }else{
            this.BanderaMostrar = true;
            console.log("llegue hasta aquí");
            this.dataSource4 = new MatTableDataSource(compras);
          }
          });
    }else{
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Seleccione alguna sucursal para continuar',
      })
    }
  }

}
