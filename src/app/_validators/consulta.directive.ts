import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ConsultaService } from "../administracion/servicios";
import { map, catchError } from "rxjs/operators";
import { Directive } from "@angular/core";
import { NG_ASYNC_VALIDATORS } from "@angular/forms";
import { forwardRef } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ClientaConsultadaValidator implements AsyncValidator {
  private roles: any = localStorage.getItem('roles');
  constructor(private consultaService :ConsultaService){}
  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
  
    let rol = JSON.parse(this.roles).roles[0].authority;
    const individual = ['GERENTE', 'ASESOR', 'COORDINADOR DE OPERACIONES'].indexOf(rol) > -1 ? false : true;
    let tipo="GRUPAL"
    if(individual)tipo="INDIVIDUAL"
    console.log(tipo)
    console.log(c.value)
    return this.consultaService.getConsultaByCurpandtipo(c.value,tipo).pipe(

    map(consulta => (Object.entries(consulta).length != 0 ? {clientaConsultada: {valid: true, link: location.origin+'/consultas/'+consulta.id+'?generar=xml'}} : null)),

    catchError(async () => null))

  /*
    return this.consultaService.getConsultaByCurp(c.value).pipe(
      map(consulta => (consulta ? {clientaConsultada: {valid: true, link: location.origin+'/consultas/'+consulta.id+'?generar=xml'}} : null)),
      catchError(() => null));*/
      
  }
}

@Directive({
selector: '[clientaConsultada]',
providers: [
  {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => ClientaConsultadaValidator),
    multi: true
  }
]})

export class ClientaConsultadaValidatorDirective{

  constructor(private validator :ClientaConsultadaValidator){}

  validate(control :AbstractControl){
    control.value.length == 18 ?
    this.validator.validate(control) : null;
  }
}
