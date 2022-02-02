import { Solicitud } from './solicitud';
import { Producto } from '../catalogo/productos/producto';

export class Detalle_solicitud
{
  solicitud: Solicitud;
  producto: Producto;
  cant_existente: number;
  cant_solicitada: number;
  cant_autorizada: number;
}
