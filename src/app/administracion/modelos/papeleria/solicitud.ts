export class Solicitud{
  id_solicitud: number;
  usuario_aprob: string;
  id_sucursal: number;
  nombre_sucursal: String;
  nombre_usuario: string;
  fecha_solicitud: Date;
  fecha_rechazo: Date;
  fecha_aprobacion: Date;
  fecha_abastecimiento: Date;
  fecha_cancelacion: Date;
  observacion_solicitud: string;
  observacion_aprobacion_rechazo: string;
  pfdc: boolean;
  estatus: string;
}
