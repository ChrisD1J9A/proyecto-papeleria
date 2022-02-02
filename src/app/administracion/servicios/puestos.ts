import { Area } from "./area"
import { Empleado } from "./empleado"
import { SubArea } from "./subarea"

export class Puestos {
    idPuesto:number| undefined
    nombrePuesto:string| undefined
    descripcion:string| undefined
    estatus:string| undefined
   // Empleados:Empleado=new Empleado
 //  idsubArea:number| undefined
 subArea:number| undefined
 area:Area=new Area
    

}