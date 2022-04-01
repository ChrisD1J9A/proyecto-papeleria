import { Solicitud } from './solicitud';

export class Detalle_solicitud_PFDC
{
  id_detalle_solicitud_PFDC: number;
  solicitud: Solicitud;
  nombreProducto: string;
  cant_existente: number;
  cant_solicitada: number;
  cant_autorizada: number;
}
