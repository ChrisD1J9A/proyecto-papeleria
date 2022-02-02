import { Regional } from "./regional";

export class Empleado {
    idEmpleado: number | undefined;
    rfc : string | undefined;
    nombre: string | undefined;
    apellidoPaterno: string | undefined;
    apellidoMaterno: string | undefined;
    regional :Regional = new Regional();
}
