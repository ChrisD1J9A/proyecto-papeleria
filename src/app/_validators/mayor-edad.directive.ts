import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[validateMayorEdad]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MayorEdadValidatorDirective, multi: true }
  ]
})
export class MayorEdadValidatorDirective {
  constructor() { }

  validate(c: AbstractControl) {
    let fechaNac = new Date(c.value);
    let edadDif = Date.now() - fechaNac.getTime();
    var edad = new Date(edadDif);

    return Math.abs(edad.getUTCFullYear() -1970) < 18 ? {validateMayorEdad: true} :null;
  }

}
