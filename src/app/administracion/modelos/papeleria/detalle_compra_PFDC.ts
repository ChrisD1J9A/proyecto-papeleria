import { Compra } from './compra';

export class Detalle_compra_PFDC
{
  id_detalle_compra_PFDC: number;
  compra: Compra;
  nombreProducto: string;
  cant_existente: number;
  cant_solicitada: number;
  cant_autorizada: number;
  cant_comprada: number;
}
