import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaxMinDeExistencia } from 'src/app/administracion/modelos/papeleria/maxMinDeExistencia';
import { MaxMinExistenciaService } from 'src/app/administracion/servicios/papeleria/max-min-existencia.service';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService } from 'src/app/administracion/servicios';

@Component({
  selector: 'app-max-min-de-existencia',
  templateUrl: './max-min-de-existencia.component.html',
  styleUrls: ['./max-min-de-existencia.component.scss']
})
export class MaxMinDeExistenciaComponent implements OnInit {
  maxMinDeExistencia: MaxMinDeExistencia = new MaxMinDeExistencia();
  MaxMins: MaxMinDeExistencia[];
  titulo: string = "Agregar nueva configuracion de existencia";
  displayedColumns: string[] = ['id_config_max_min', 'sucursal', 'usuario_modifico', 'max_existencia', 'min_existencia', 'fecha_creacion', 'fecha_act', 'action'];
  dataSource = new MatTableDataSource();
  maxMinFR = new FormControl('', [Validators.required]);
  sucursales!: Sucursal[];
  sucursal = new Sucursal();
  banderaEditar = true;
  editCheckB = false;
  controlMax = new FormControl();

  constructor(private maxMinS: MaxMinExistenciaService,
    private sucursalService: SucursalService) { }

  ngOnInit(): void {
    this.maxMinS.getMaxMinDeExistenciaA().subscribe(
      maxMinss => {
        this.MaxMins = maxMinss;
        this.dataSource = new MatTableDataSource(maxMinss);
      });
    this.sucursalService.getSucursales().subscribe(val => {
      this.sucursales = val;
    });
    this.limpiar();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public limpiar() {
    this.maxMinDeExistencia = new MaxMinDeExistencia();
    this.sucursal = new Sucursal();
    this.banderaEditar = true;
    this.editCheckB = false;
  }

  cargarMaxMins(id_maxMinDeExistencia) {
    swal.fire({
      title: '¿Desea editar este elemento?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (id_maxMinDeExistencia) {
          this.maxMinS.getMaxMinDeExistencia(id_maxMinDeExistencia).subscribe((response) => {
            if (response) {
              this.maxMinDeExistencia = response
              this.banderaEditar = false;
              this.editCheckB = true;
            } else { }
          })
        }
      }
    })
  }

  public create(): void {
    var config = this.consultaConfigPorSucurasl(this.maxMinDeExistencia);

    if(config == null ){
      if (this.maxMinDeExistencia.max_existencia) {
        swal.fire({
          title: '¿Desea guardar este nuevo elemento?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.maxMinDeExistencia.sucursal = this.sucursal.nombreSucursal;
            this.maxMinDeExistencia.estatus = "Activo";
            this.maxMinDeExistencia.fecha_creacion = new Date();
            this.maxMinDeExistencia.fecha_actualizacion = new Date();
            this.maxMinDeExistencia.usuario_modifico = JSON.parse(localStorage.getItem('nombreCUsuario')!);;
            this.maxMinS.create(this.maxMinDeExistencia).subscribe(
              maxMiin => {
                //window.location.reload();
                this.ngOnInit();
              })
            swal.fire('Guardado', `La configuracion fue guardada con éxito!`, 'success')
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
    }else{
      swal.fire('Ya existe una configuracion para esa sucursal', '', 'error');
    }
  }

  update(): void {
    if (this.maxMinDeExistencia.max_existencia || this.maxMinDeExistencia.min_existencia) {
      swal.fire({
        title: '¿Desea actualizar este elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          //  this.unidad.estatus = 1;
          this.maxMinDeExistencia.fecha_actualizacion = new Date();
          this.maxMinS.update(this.maxMinDeExistencia)
            .subscribe(element => {
              //window.location.reload();
              this.ngOnInit();
            })
          swal.fire('Actualizado', `La configuracion se ha actualizado con éxito!`, 'success')
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

  validarMaxMin(n: number) {
    this.controlMax = new FormControl(n, Validators.max(n - 1));
  }

  getErrorMessage() {
    return this.controlMax.hasError('max') ? 'El mínimo de existencia no puede ser mayor al máximo' : '';
  }

  consultaConfigPorSucurasl(maxMin: MaxMinDeExistencia): MaxMinDeExistencia {
    var nombreSucursal: string = maxMin.sucursal;
    var configuracion: MaxMinDeExistencia;
    this.maxMinS.getMaxMinDeExistenciaBySucursal(nombreSucursal).subscribe(
      maxMinCnfg => {
        configuracion = maxMinCnfg;
      });
    return configuracion;
  }

}
