import { Solicitud } from './solicitud';

export class Detalle_solicitud_pfdc
{
  id_detalle_solicitud_pfdc: number;
  solicitud: Solicitud;
  nombreProducto: string;
  cant_existente: number;
  cant_solicitada: number;
  cant_autorizada: number;
}
