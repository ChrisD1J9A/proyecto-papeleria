import { Injectable, Directive, forwardRef } from "@angular/core";
import { AsyncValidator, AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { CreditoActivoService } from "../administracion/servicios/credito-activo.service";
import { map, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class CreditoActivoValidator implements AsyncValidator {

  constructor(private creditoActivoService :CreditoActivoService){ }


  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> | null {
    let rol = JSON.parse(localStorage.getItem('roles')).roles[0].authority;
    return ['GERENTE','ASESOR','COORDINADOR DE OPERACIONES','METODOS Y PROCEDIMIENTOS'].indexOf(rol) > -1 ?
    this.creditoActivoService.getCreditoActivo(c.value).pipe(map(credito => (credito != null ? {creditoActivo: {valid: true, credito: credito}} : null)),
    catchError(() => null))
    : of(null);
  }
}

@Directive({
selector: '[creditoActivo]',
providers: [
  {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => CreditoActivoValidator),
    multi: true
  }
]})

export class CreditoActivoValidatorDirective{

  constructor(private validator :CreditoActivoValidator) {
  }

  validate(control :AbstractControl){
    control.value.length == 18 ? this.validator.validate(control) : null;
  }

}
