import { Empleado } from "./empleado"
import { Region } from "./region"

export class Sucursal {
    idSucursal:number| undefined
    centroCosto:string| undefined
    nombreSucursal:string| undefined
    descripcion:string| undefined
    estatus:string| undefined
    calle:string| undefined
    numero:string| undefined
    colonia:string| undefined
    codigoPostal:number| undefined
    municipio:string| undefined
    estado:string| undefined
    telefono:string| undefined
    claveMetas:string| undefined
    region:Region=new Region
    empleados:Array<Empleado>=new Array;
    idProducto:number|undefined

}