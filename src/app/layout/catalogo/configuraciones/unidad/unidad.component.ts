import { Component, OnInit } from '@angular/core';
import { Unidad } from 'src/app/administracion/modelos/papeleria/unidad';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadService } from 'src/app/administracion/servicios/papeleria/unidad.service';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
//import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.scss']
})

export class UnidadComponent implements OnInit {
  unidad: Unidad = new Unidad();
  unidades: Unidad[];
  titulo: string = "Agregar nueva Unidad";
  displayedColumns: string[] = ['id_unidad', 'descripcion', 'estatus', 'action'];
  dataSource = new MatTableDataSource();
//  clickedRows = new Set<Unidad>();
  descripcionUnidad = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.unidadService.getUnidades().subscribe(
      unidades => {
        this.unidades = unidades
        this.dataSource = new MatTableDataSource(unidades);
      });
    //this.dataSource = new MatTableDataSource(this.unidades);
    //console.log(this.dataSource);
    this.limpiar();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private unidadService: UnidadService, private activatedRoute: ActivatedRoute) {

  }

  getErrorMessage() {
    return this.descripcionUnidad.hasError('required') ? 'Ingrese algún dato' : '';
  }

  public limpiar() {
    this.unidad = new Unidad();
  }

  public cargarUnidad(id_unidad): void {
    swal.fire({
      title: '¿Desea editar este elemento?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (id_unidad) {
          this.unidadService.getUnidad(id_unidad).subscribe((response) => {
            if (response) {
              this.unidad = response
            } else { }
          })
        }
      }
    })
  }

  public create(): void {
    if (this.unidad.descripcion) {
      swal.fire({
        title: '¿Desea guardar este nuevo elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.unidad.estatus = 1;
          this.unidadService.create(this.unidad).subscribe(
            unidad => {
              //window.location.reload();
              this.ngOnInit();
            })
          swal.fire('Guardado', `La unidad ${this.unidad.descripcion} fue guardada con éxito!`, 'success')
        } else if (result.isDenied) {
          swal.fire('El elemento no fue guardado', '', 'info')
        }
      })
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  update(): void {
    if (this.unidad.descripcion) {
      swal.fire({
        title: '¿Desea actualizar este elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          //  this.unidad.estatus = 1;
          this.unidadService.update(this.unidad)
            .subscribe(unidad => {
              window.location.reload();
            })
          swal.fire('Actualizado', `Unidad ${this.unidad.descripcion} actualizado con éxito!`, 'success')
        } else if (result.isDenied) {
          swal.fire('El elemento no fue actualizado', '', 'info')
        }
      })
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  baja(unidad: Unidad): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja esta Unidad?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          unidad.estatus = 0;
          this.unidadService.update(unidad).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `La unidad:  ${response.descripcion} fue dado de baja con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la unidad`,
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

  activar(unidad: Unidad): void {
    swal
      .fire({
        title: '¿Está seguro de activar esta Unidad?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          unidad.estatus = 1;
          this.unidadService.update(unidad).subscribe(
            (response) => {
              if (response) {
                swal.fire(
                  'Mensaje',
                  `La unidad:  ${response.descripcion} fue activada con éxito`,
                  'success'
                );
                //  window.location.reload();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la unidad`,
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
//const unidades: Unidad [] = unidadService.getUnidades();
