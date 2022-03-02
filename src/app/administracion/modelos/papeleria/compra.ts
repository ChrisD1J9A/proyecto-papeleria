import { Solicitud }  from './solicitud';
import { Proveedor } from './proveedor';

export class Compra{
  id_compra: number;
  solicitud: Solicitud;
  proveedor: Proveedor;
  usuario: number;
  fecha_creacion: Date;
  gasto_total: number;
  ticket: String;
  observaciones: String;
  estatus: String;
}
