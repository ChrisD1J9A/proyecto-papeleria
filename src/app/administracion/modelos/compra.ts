import { Solicitud }  from '../../layout/solicitudes/solicitud';
import { Proveedor } from '../../layout/catalogo/proveedores/proveedor';

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
