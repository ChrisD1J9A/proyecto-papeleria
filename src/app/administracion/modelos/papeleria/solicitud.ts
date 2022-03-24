export class Solicitud{
  id_solicitud: number;
  id_usuario_aprob: number;
  id_sucursal: number;
  sucursal: String;
  nombre_usuario: string;
  fecha_solicitud: Date;
  fecha_rechazo: Date;
  fecha_aprobacion: Date;
  fecha_abastecimiento: Date;
  fecha_cancelacion: Date;
  observacion_solicitud: string;
  observacion_aprobacion_rechazo: string;
  estatus: string;
}
