import  { Inventario } from './inventario';
import  { Producto } from './producto';

export class Detalle_inventario
{
  inventario: Inventario;
  producto: Producto;
  cant_existente: number;
  estatus: string;
  fecha_ultima_actualizacion: Date; 
}
