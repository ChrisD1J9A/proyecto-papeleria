import { Component, OnInit } from '@angular/core';
import { Unidad } from 'src/app/administracion/modelos/papeleria/unidad';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadService } from 'src/app/administracion/servicios/papeleria/unidad.service';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.scss']
})

export class UnidadComponent implements OnInit {
  unidad: Unidad = new Unidad(); //Objeto Unidad
  unidades: Unidad[];//Arreglo que almacena las unidades de la base de datos
  titulo: string = "Agregar nueva Unidad";//titulo del html
  displayedColumns: string[] = ['id_unidad', 'descripcion', 'estatus', 'action'];//Encabezados de las columnas de la tabla
  dataSource = new MatTableDataSource(); //Tabla de las unidades que provienen de la base de datos
  descripcionUnidad = new FormControl('', [Validators.required]);//Form control para manejo de errores

  ngOnInit() {
    this.unidadService.getUnidades().subscribe( //Obtenemos todas las unidades de la base de datos
      unidades => {
        this.unidades = unidades;//Cargamos estas unidades en el arreglo de unidades
        this.dataSource = new MatTableDataSource(unidades); //Caragamos los datos a la tabla
      });
    this.limpiar(); //Se inicializa el objeto Unidad
  }

  //Metodo que se usa para realizar busquedas en la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private unidadService: UnidadService, private activatedRoute: ActivatedRoute) {

  }

  //Metodo usado para lanzar mensaje de error
  getErrorMessage() {
    return this.descripcionUnidad.hasError('required') ? 'Ingrese algún dato' : '';
  }

  //Metodo que inicializa el objeto unidad, que sirve para limpiar el formulario  al cual esta asociado este objeto
  public limpiar() {
    this.unidad = new Unidad();
  }

  //Metodo que entra en funcion al momento que el usuario decida editar una unidad existente
  public cargarUnidad(id_unidad): void {
    swal.fire({//Pregunta antes de continuar
      title: '¿Desea editar este elemento?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (id_unidad) { //Valida que si existe el valor
          this.unidadService.getUnidad(id_unidad).subscribe((response) => { //Se consulta en la base de datos
            if (response) { //Si se obtiene
              this.unidad = response//Se carga al objeto  Unidad que se asocia al formulario
            } else { }
          })
        }
      }
    })
  }

  //Metodo mediante el cual se guarda la nueva unidad
  public create(): void {
    if (this.unidad.descripcion) { //Valida que el usuario rellenó el campo obligatorio
      swal.fire({
        title: '¿Desea guardar este nuevo elemento?',//Pregunta si se desea continuar
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.unidad.estatus = 1; //Se asigna de estatus 1(Activo)
          this.unidadService.create(this.unidad).subscribe(
            unidad => {
              this.ngOnInit();//El componente vuelve a su estado inicial
            })
          swal.fire('Guardado', `La unidad ${this.unidad.descripcion} fue guardada con éxito!`, 'success');//Mensaje de confirmacion
        } else if (result.isDenied) {
          swal.fire('El elemento no fue guardado', '', 'info');//Mensaje de que no se guardo la nueva unidad
        }
      })
    } else {
      swal.fire({//Mensaje que informa al usuario de que rellene el dato obligatorio
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  //Metodo para actualizar
  update(): void {
    if (this.unidad.descripcion) {//Valida si se rellenó el dato obligatorio
      swal.fire({
        title: '¿Desea actualizar este elemento?',//Pregunta antes de continuar
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.unidadService.update(this.unidad)//Se actualiza la base de datos
            .subscribe(unidad => {
              this.ngOnInit();//El componente retoma su estado inicial
            })
          swal.fire('Actualizado', `Unidad ${this.unidad.descripcion} actualizado con éxito!`, 'success');//Mensaje de confirmacion
        } else if (result.isDenied) {
          swal.fire('El elemento no fue actualizado', '', 'info');//Mensaje  de no  guardado
        }
      });
    } else {//En caso de que el usuario no ingresó el valor requerido
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  //Metodo para dar de Baja una unidad
  baja(unidad: Unidad): void {
    swal
      .fire({
        title: '¿Está seguro de dar de baja esta Unidad?',//El sistema pregunta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          unidad.estatus = 0;//Se cambia el estatus a 0 (Inactivo)
          this.unidadService.update(unidad).subscribe(
            (response) => {//Se actualiza la base de datos
              if (response) {
                swal.fire(
                  'Mensaje',
                  `La unidad:  ${response.descripcion} fue dado de baja con éxito`, //Mensaje de confirmacion
                  'success'
                );
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la unidad`, //Si ocurriese algún error
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

  //Metodo para reactivar la unidad
  activar(unidad: Unidad): void {
    swal
      .fire({
        title: '¿Está seguro de activar esta Unidad?',//Se pregunta al usuario antes de continuar
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          unidad.estatus = 1;//Estatus cambia a 1 (Unidad activa)
          this.unidadService.update(unidad).subscribe(
            (response) => {//Se actualiza la base de datos
              if (response) {
                swal.fire(
                  'Mensaje',
                  `La unidad:  ${response.descripcion} fue activada con éxito`,//Menaje exitoso
                  'success'
                );
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la unidad`,//Mensaje de error
                  'error'
                );
              }
            },
            (error) => {
              swal.fire('Error', `Error al dar de baja`, 'error');//Mensaje de error
            }
          );
        }
      });
  }
}
