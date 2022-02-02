import { Empleado } from "./empleado"
import { Perfil } from "./perfil"

export class Usuario {
    idUsuario:number| undefined
    username:| undefined
    password:| undefined
    estatus:| undefined
    empleado:Empleado=new Empleado
    perfiles:Array<Perfil>=new Array
    

}