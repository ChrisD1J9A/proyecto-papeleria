import {Unidad} from '../configuraciones/unidad/unidad';

export class Producto {
    id_producto: number;
    unidad: Unidad;
    descripcion: String;
    precio_iva: number;
    precio_subtotal: number;
    precio_total: number;
    estatus: number;
    observaciones: String;
}
