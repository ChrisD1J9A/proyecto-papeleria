import { Solicitud }  from './solicitud';
import { Proveedor } from './proveedor';

export class Compra{
  id_compra: number;
  solicitud: Solicitud;
  proveedor: Proveedor;
  id_sucursal: number;
  nombre_sucursal: String;
  usuario: String;
  fecha_creacion: Date;
  gasto_total: number;
  ticket: String;
  observaciones: String;
  estatus: String;
}
