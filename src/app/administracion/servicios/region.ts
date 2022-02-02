import { Empleado } from "./empleado"
import { Sucursal } from "./sucursal"

export class Region {
    idRegion:number=-1
    nombreRegion:string=""
    descipcion:string=""
    estatus:string=""
    sucursal:Array<Sucursal>=new Array
    empleado:Array<Empleado>=new Array

}