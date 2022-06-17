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
  banderaCarga: Boolean;//Bandera para activar un spinner
  error: boolean;//Bandera para mostrar un mensaje de error en el sistema
  titulo;//titulo del html
  displayedColumns: string[] = ['id_unidad', 'descripcion', 'estatus', 'action'];//Encabezados de las columnas de la tabla
  dataSource = new MatTableDataSource(); //Tabla de las unidades que provienen de la base de datos
  descripcionUnidad = new FormControl('', [Validators.required]);//Form control para manejo de errores

  ngOnInit() {
    this.banderaCarga = false;
    this.error = false;
    this.titulo= "Agregar nueva Unidad"
    this.unidadService.getUnidades().subscribe( //Obtenemos todas las unidades de la base de datos
      (unidades) => {
        this.unidades = unidades;//Cargamos estas unidades en el arreglo de unidades
        this.dataSource = new MatTableDataSource(unidades); //Cargamos los datos a la tabla
      },
      (err) => {
        //En caso de error muestra el mensaje de alerta en el sistema
        this.error = true;
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
    this.titulo= "Agregar nueva Unidad";
  }

  //Metodo que entra en funcion al momento que el usuario decida editar una unidad existente
  public cargarUnidad(id_unidad): void {
    //Se activa el spinner de carga
    this.banderaCarga = true;
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
              //Se deteniene el spinner de carga y cambia el titulo del sistema
              this.banderaCarga = false;
              this.titulo= "Actualizar Unidad"
              this.unidad = response//Se carga al objeto  Unidad que se asocia al formulario
            } else {
              //Mensaje en dado caso de que no se pudo realizar correctamente la actualizacion
              swal.fire('Oops', 'Ocurrió un error al actualizar', 'error');
             }
          },
          (err) => {
            //Detiene el spinner de carga
            this.banderaCarga = false;
            //Si ocurre un error muestra un mensaje de alerta de error
            swal.fire(err.error.mensaje,`Error al querer actualizar la unidad`,'error');
          });
        }
      }else{
        //Detiene el spinner de carga
        this.banderaCarga = false;
      }
    })
  }

  //Metodo mediante el cual se guarda la nueva unidad
  public create(): void {
    this.banderaCarga = true;
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
            (response) => {
              if(response.unidad){//Se corrobora que se realizó la insersión
                this.ngOnInit();//El componente vuelve a su estado inicial
                //Mensaje de confirmacion
                swal.fire('Guardado', `La unidad ${response.unidad.descripcion} fue guardada con éxito!`, 'success');
              }else{
                //Mensaje en dado caso de que no se pudo realizar correctamente la insersión
                swal.fire('Oops', 'Ocurrió un error al insertar', 'error');
              }
            },
            (err) => {
              //Detiene el spinner de carga
              this.banderaCarga = false;
              //Si ocurre un error muestra un mensaje de alerta de error
              swal.fire(err.error.mensaje,`Error al insertar la unidad`,'error');
            });
        } else if (result.isDenied) {
          //Se  desactiva el spinner
          this.banderaCarga=false;
          swal.fire('El elemento no fue guardado', '', 'info');//Mensaje de que no se guardo la nueva unidad
        }
      })
    } else {
      swal.fire({//Mensaje que informa al usuario de que rellene el dato obligatorio
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      });
      //Se desactiva el spinner
      this.banderaCarga=false;
    }
  }

  //Metodo para actualizar
  update(): void {
    this.banderaCarga = true;
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
            .subscribe((response) => {
              if(response.unidad)
              {
                this.ngOnInit();//El componente retoma su estado inicial
                swal.fire('Actualizado', `Unidad ${response.unidad.descripcion} actualizado con éxito!`, 'success');//Mensaje de confirmacion
              }else{
                swal.fire('Mensaje','Error al actualizar la unidad','error');
              }
            },
            (err) => {
              //Detiene el spinner de carga
              this.banderaCarga = false;
              //Si ocurre un error muestra un mensaje de alerta de error
              console.error(err.error.mensaje);
              swal.fire(err.error.mensaje,'Error al actualizar la unidad','error');
            });
        } else if (result.isDenied) {
          //Desactivar spinner
          this.banderaCarga = false;
          swal.fire('El elemento no fue actualizado', '', 'info');//Mensaje  de no  guardado
        }
      });
    } else {//En caso de que el usuario no ingresó el valor requerido
      //Desactivar spinner
      this.banderaCarga = false;
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  //Metodo para dar de Baja una unidad
  baja(unidad: Unidad): void {
    this.banderaCarga = true;
    swal.fire({
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
              if (response.unidad) {
                swal.fire(
                  'Mensaje',
                  `La unidad:  ${response.unidad.descripcion} fue dado de baja con éxito`, //Mensaje de confirmacion
                  'success'
                );
                this.ngOnInit();
              }else{
                //Si ocurriese algún error
                swal.fire('Mensaje',`Error al dar de baja la unidad`,'error');
              }
            },
            (err) => {
                this.banderaCarga = false;
              swal.fire('Error', `Error al dar de baja`, 'error');
            });
        }else{
          //se desactiva el spinner
          this.banderaCarga=false;
        }
      });
  }

  //Metodo para reactivar la unidad
  activar(unidad: Unidad): void {
    //Se inicia el spinner de carga
    this.banderaCarga = true;
    swal.fire({
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
              if (response) {//Menaje exitoso
                swal.fire('Mensaje',`La unidad:  ${unidad.descripcion} fue activada con éxito`,'success');
                this.ngOnInit();
              } else {
                swal.fire(
                  'Mensaje',
                  `Error al dar de baja la unidad`,//Mensaje de error
                  'error'
                );
              }
            },
            (error) => {
              //Detiene el spinner de carga
              this.banderaCarga = false;
              swal.fire('Error', `Error al activar la unidad`, 'error');//Mensaje de error
            }
          );
        }else{
          //Detiene el spinner de carga
          this.banderaCarga = false;
        }
      });
  }
}
