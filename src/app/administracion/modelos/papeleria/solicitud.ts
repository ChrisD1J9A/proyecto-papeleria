export class Solicitud{
  id_solicitud: number;
  usuario_aprob: string;
  idSucursal: number;
  nombre_sucursal: string;
  nombre_usuario: string;
  correo_solicitante: string;
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
