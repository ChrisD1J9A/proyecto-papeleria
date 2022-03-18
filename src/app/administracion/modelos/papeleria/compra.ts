import { Solicitud }  from './solicitud';
import { Proveedor } from './proveedor';

export class Compra{
  id_compra: number;
  id_sucursal: number;
  solicitud: Solicitud;
  proveedor: Proveedor;
  usuario: String;
  fecha_creacion: Date;
  gasto_total: number;
  ticket: String;
  observaciones: String;
  estatus: String;
}
