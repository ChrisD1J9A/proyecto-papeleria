import { Component, OnInit } from '@angular/core';
import { DetalleSolicitudPFDCService } from 'src/app/administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-productos-fdcview',
  templateUrl: './productos-fdcview.component.html',
  styleUrls: ['./productos-fdcview.component.scss']
})
export class ProductosFDCViewComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['producto', 'action'];//Encabezados de la tabla de productos fuera del catálogo

  constructor(private pfdc: DetalleSolicitudPFDCService, private router: Router,) { }

  ngOnInit(): void {
    this.cargarPfdc();
  }

  //Metodo para ubicar un elemento en la tabla, deacuerdo a lo que el usuario ingrese
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Metodo para consultar y cargar  a la tabla los productos fuera del catalogo
  cargarPfdc() {
    this.pfdc.getDetallesSolicitud_PFDC_All().subscribe(//Se realiza la consulta al back a traves del service
      datos => {
        datos.sort(function(a, b) { //A los datos obtenidos se les aplica un sort para ordenarlos alfabeticamente
          if (a.nombreProducto > b.nombreProducto) {//Es necesario esta parte para especificar que será a traves del nombreProducto el ordenaniento
            return 1;
          }
          if (a.nombreProducto < b.nombreProducto) {//De manera convencional se ordenaria con un Sort() pero este lo ordena por el identificador y lo que interesa es ordenarlo alfabeticamente
            return -1;
          }
          return 0;
        });
        //Se realiza un sort para que visualmente sea de mas ayuda al usuario
        this.dataSource = new MatTableDataSource(datos.sort());//Se cargan los datos
      });
  }
}
