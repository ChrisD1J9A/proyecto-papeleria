import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/administracion/modelos/papeleria/proveedor';
import { ProveedoresService } from 'src/app/administracion/servicios/papeleria/proveedores.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema
  proveedor = new Proveedor(); //Objeto proveedor
  proveedores: Proveedor[];//Arreglo de proveedores
  displayedColumns: string[] = ['id_proveedor', 'nombre', 'direccion', 'telefono', 'rfc', 'estatus', 'action'];//Encabezados para las columnas de la tabla de proveedores
  dataSource = new MatTableDataSource(); //Almacena los proveedores provenientes de la base de datos

  constructor(private proveedoresService: ProveedoresService) { }

  ngOnInit(): void {
    this.error = false;
    this.proveedoresService.getProveedores().subscribe(//Se obtiene de la base de datos los proveedores
      (proveedores) => {
        this.proveedores = proveedores;//Se almacenan los datos obtenidos en el respectivo array
        this.dataSource = new MatTableDataSource(proveedores);//Los datos ademas se agregan a la tabla
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta en el sistema
        this.error = true;
      });
  }

  //Metodo que entra en uso cuando el usuario busca un dato en especifico en la tabla de proveedores
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Metodo utilizado para dar de baja un proveedor
  baja(proveedor: Proveedor): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja este Proveedor?', //Se pregunta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          proveedor.estatus = 0; //El estatus se cambia a 0 (Inactivo o dado de baja)
          this.proveedoresService.update(proveedor).subscribe(//Se actualiza el elemento en la base de datos
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El proveedor:  ${proveedor.nombre} fue dado de baja con éxito`, //Mensaje de confirmación exitosa
                  'success'
                );
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el proveedor`, //Mensaje de error en caso de haberlo
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error'); //Mensaje de error en caso de haberlo
            }
          );
        }
      });
  }

  //Metodo para activar un proveedor
  activar(proveedor: Proveedor): void {
    swal
      .fire({
        title: '¿Está seguro de activar este Proveedor?', //Se pregunta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          proveedor.estatus = 1; //El estatus cambia a 1 (Activado)
          this.proveedoresService.update(proveedor).subscribe(//Se actualiza el proveedor en la base de datos
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `El proveedor:  ${proveedor.nombre} fue activado con éxito`, //Mensaje de actualizacion exitosa
                  'success'
                );
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja el proveedor`, //Mensaje de error en caso de haberlo
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error'); //Mensaje de error en caso de haberlo
            }
          );
        }
      });
  }

}
