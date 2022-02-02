import { Sistema } from "./sistema"
import { Tarea } from "./tarea"
import { Usuario } from "./usuario"

export class Perfil {
    idPerfil:number| undefined
    nomPerfil:string| undefined
    desPerfil:string| undefined
    estatus:string| undefined
    usuarios:Array<Usuario>=new Array
    tareas:Array<Tarea>=new Array
    sistemas:Array<Sistema>=new Array

}