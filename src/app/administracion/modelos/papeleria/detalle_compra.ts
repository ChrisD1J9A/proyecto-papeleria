import { Compra } from './compra';
import { Producto } from './producto';

export class Detalle_compra{
  compra: Compra;
  producto: Producto;
  cant_existente: number;
  cant_solicitada: number;
  cant_autorizada: number;
  cant_comprada: number;
}
