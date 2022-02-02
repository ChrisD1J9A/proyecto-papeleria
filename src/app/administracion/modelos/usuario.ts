import { Perfil } from './perfil';
import { Empleado } from './empleado';
import { Sucursal } from './sucursal';

export class Usuario {
    username: string | undefined;
    password: string | undefined;
    estatus: string | undefined;
    empleado: Empleado = new Empleado();
    perfil: Perfil = new Perfil();
    sucursales: Sucursal[] = [];
}
