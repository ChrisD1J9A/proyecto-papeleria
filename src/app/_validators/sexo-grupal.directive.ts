import { AbstractControl, NG_VALIDATORS } from "@angular/forms";
import { Directive } from "@angular/core";


@Directive({
  selector: '[sexoGrupal]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: SexoGrupalDirective, multi: true }
  ]
})
export class SexoGrupalDirective {
  constructor() { }

  validate(c: AbstractControl) {
    let rol = JSON.parse(localStorage.getItem('roles')).roles[0].authority;

    return ['GERENTE','ASESOR','COORDINADOR DE OPERACIONES','METODOS Y PROCEDIMIENTOS'].indexOf(rol) > -1 && c.value == 'M'? {sexoGrupal: true} :null;
  }

}
