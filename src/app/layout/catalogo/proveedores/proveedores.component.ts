import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from './proveedor';
import { ProveedoresService } from './proveedores.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  proveedor = new Proveedor();
  proveedores: Proveedor[];
  displayedColumns: string[] = ['id_proveedor', 'nombre', 'direccion', 'telefono', 'rfc', 'estatus', 'action'];
  dataSource = new MatTableDataSource();

  constructor(private proveedoresService: ProveedoresService) { }

  ngOnInit(): void {
    this.proveedoresService.getProveedores().subscribe(
      proveedores => {
        this.proveedores = proveedores
        this.dataSource = new MatTableDataSource(proveedores);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  baja(proveedor: Proveedor): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja este Proveedor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          proveedor.estatus = 0;
          this.proveedoresService.update(proveedor).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El proveedor:  ${response.nombre} fue dado de baja con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el proveedor`,
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error');
            }
          );
        }
      });
  }

  activar(proveedor: Proveedor): void {
    swal
      .fire({
        title: '¿Está seguro de activar este Proveedor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          proveedor.estatus = 1;
          this.proveedoresService.update(proveedor).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El proveedor:  ${response.nombre} fue activado con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el proveedor`,
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error');
            }
          );
        }
      });
  }

}
