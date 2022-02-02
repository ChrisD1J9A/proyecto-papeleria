import { Sucursal } from './sucursal';

export class Region {
    idRegion :number | undefined;
    nombreRegion :string | undefined;
    descripcionRegion :string | undefined;
    sucursales: Sucursal[] = [];
}
