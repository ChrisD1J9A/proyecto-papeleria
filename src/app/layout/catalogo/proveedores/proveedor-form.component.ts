import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Proveedor } from './proveedor';
import { ProveedoresService } from './proveedores.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  titulo: string = "Agregar nuevo Producto";
  titulo2: string = "Editar Producto";
  proveedor = new Proveedor();
  proveedores: Proveedor[];
  nombreProveedor = new FormControl('', [Validators.required]);
  telefonoProveedor = new FormControl('1', Validators.pattern('^((\\+91-?)|0)?[0-9]{6,10}$'));
  rfcflag: boolean;
  _rfc_pattern_pm = "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";
  // patron del RFC, persona fisica
  _rfc_pattern_pf = "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
    "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

  rfcProveedor = new FormControl('', [Validators.required]);
  rfcmsg: String;

  constructor(private proveedoresService: ProveedoresService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarProveedor();
  }

  getErrorMessage() {
    return this.nombreProveedor.hasError('required') ? 'Ingrese algún dato' : '';
  }

  getErrorMessage2() {
    return this.rfcProveedor.hasError('required') ? 'Igrese algún dato' : '';
  }


  getErrorMessage3() {
    return this.telefonoProveedor.hasError('pattern') ? 'Sólo ingrese al menos 6 números' : '';
  }

  cargarProveedor(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.proveedoresService.getProveedor(id).subscribe(
          (proveedor) => this.proveedor = proveedor
        )
      }
    })
  }

  ValidaRFC(rfc: any) {
    //var rfc = document.getElementById("ConsultaForm:rfc").value;
    if (rfc.match(this._rfc_pattern_pm) || rfc.match(this._rfc_pattern_pf)) {
      this.rfcmsg = "La estructura de la clave de RFC es valida";
      this.rfcflag = true;
    } else {
      this.rfcmsg = "La estructura de la clave de RFC es incorrecta";
      this.rfcflag = false;
    }
  }

  public create(): void {
    if (this.proveedor.nombre && this.proveedor.rfc) {
      if (this.rfcflag == true) {
        swal.fire({
          title: '¿Desea guardar este nuevo elemento? ',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.proveedor.estatus = 1;
            this.proveedoresService.create(this.proveedor).subscribe(
              response => {
                this.router.navigate(['/layout/proveedores'])
                this.ngOnInit();
              })
            swal.fire('Guardado', `El proveedor ${this.proveedor.nombre} fue guardado con éxito!`, 'success')
          } else if (result.isDenied) {
            swal.fire('El elemento no fue guardado', '', 'info')
          }
        })
      } else {
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El formato del rfc es incorrecto',
        })
      }
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  public update(): void {
    if (this.proveedor.nombre && this.proveedor.rfc) {
      if (this.rfcflag == false) {
        swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'formato del RFC inválido',
        })
      } else {
        swal.fire({
          title: '¿Desea actualizar este elemento?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Si',
          denyButtonText: `No guardar`,
        }).then((result) => {
          if (result.isConfirmed) {
            //  this.unidad.estatus = 1;
            this.proveedoresService.update(this.proveedor)
              .subscribe(proveedor => {
                this.router.navigate(['/layout/proveedores'])
                this.ngOnInit();
              })
            swal.fire('Actualizado', `El proveedor ${this.proveedor.nombre} actualizado con éxito!`, 'success')
          } else if (result.isDenied) {
            swal.fire('El elemento no fue actualizado', '', 'info')
          }
        })
      }
      //this.ngOnInit();
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese algún dato para continuar',
      })
    }
  }

  public cancel(): void {
    this.router.navigate(['/layout/proveedores'])
    this.ngOnInit();
  }

}
