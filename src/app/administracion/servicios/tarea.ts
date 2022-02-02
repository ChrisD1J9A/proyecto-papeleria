import { Perfil } from "./perfil"

export class Tarea {
    idTarea:number| undefined
    nombreTarea:string| undefined
    direccionTarea:string| undefined
    descipcion:string| undefined
    instrucciones:string| undefined
    tipoClasificacion:string| undefined
    icono:string| undefined
    url:string|undefined
    idPadre:number| undefined
    perfil:Array<Perfil>=new Array    
    idSistema:number|undefined
    estatus:string|undefined

}