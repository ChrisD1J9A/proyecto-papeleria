import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaxMinDeStock } from 'src/app/administracion/modelos/papeleria/maxMinDeStock';
import { MaxMinStockService } from 'src/app/administracion/servicios/papeleria/max-min-stock.service';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Sucursal } from 'src/app/administracion/modelos/sucursal';
import { SucursalService} from 'src/app/administracion/servicios';


@Component({
  selector: 'app-max-min-de-stock',
  templateUrl: './max-min-de-stock.component.html',
  styleUrls: ['./max-min-de-stock.component.scss']
})
export class MaxMinDeStockComponent implements OnInit {
  maxMinDeStock: MaxMinDeStock = new MaxMinDeStock();
  MaxMins: MaxMinDeStock[];
  titulo: string = "Agregar nueva configuracion de stock";
  displayedColumns: string[] = ['id_config_max_min', 'sucursal', 'usuario_modifico', 'max_stock', 'min_stock', 'fecha_creacion', 'fecha_act', 'action'];
  dataSource = new MatTableDataSource();
  maxMinFR = new FormControl('', [Validators.required]);
  sucursales: Sucursal[];
  sucursal = new Sucursal();
  banderaEditar = true;
  editCheckB = false;

  constructor(private maxMinS: MaxMinStockService,
              private sucursalService:SucursalService) { }

  ngOnInit(): void {
    this.maxMinS.getMaxMinDeStockA().subscribe(
      maxMinss => {
        this.MaxMins = maxMinss;
          this.dataSource = new MatTableDataSource(maxMinss);
      });
      this.sucursalService.getSucursales().subscribe(val=>{
          this.sucursales=val;
      });
      this.limpiar();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public limpiar() {
    this.maxMinDeStock = new MaxMinDeStock();
    this.sucursal = new Sucursal();
    this.banderaEditar = true;
    this.editCheckB = false;
  }

  cargarMaxMins(id_maxMinDeStock)
  {
    swal.fire({
      title: '¿Desea editar este elemento?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (id_maxMinDeStock) {
          this.maxMinS.getMaxMinDeStock(id_maxMinDeStock).subscribe((response) => {
            if (response) {
              this.maxMinDeStock = response
              this.banderaEditar = false;
              this.editCheckB = true;
            } else { }
          })
        }
      }
    })
  }

  public create(): void {
    if (this.maxMinDeStock.max_stock) {
      swal.fire({
        title: '¿Desea guardar este nuevo elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.maxMinDeStock.sucursal = this.sucursal.nombreSucursal;
          this.maxMinDeStock.estatus = "Activo";
          this.maxMinDeStock.fecha_creacion = new Date();
          this.maxMinDeStock.fecha_actualizacion =  new Date();
          this.maxMinDeStock.usuario_modifico = "Cristofher Diego (cambiar esto xD)";
          this.maxMinS.create(this.maxMinDeStock).subscribe(
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
  }

  update(): void {
    if (this.maxMinDeStock.max_stock || this.maxMinDeStock.min_stock) {
      swal.fire({
        title: '¿Desea actualizar este elemento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          //  this.unidad.estatus = 1;
          this.maxMinDeStock.fecha_actualizacion = new Date();
          this.maxMinS.update(this.maxMinDeStock)
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
}
