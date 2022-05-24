import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  ticket: string;
}

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {
  esPdf: boolean;

  constructor(public dialogRef: MatDialogRef<TicketViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData//Se obtiene la información del ticket
            ) { this.tipoArchivo();}

  ngOnInit(): void {
  }

  //Método para saber cual de los dos tipos de archivo es el ticket
  tipoArchivo()
  {
    if(this.data.ticket.endsWith(".pdf")===true)
    {
      this.esPdf = true;// Si es true la bandera esPdf se activa
    }else{
      this.esPdf = false;// Si es true la bandera esPdf se desactiva
    }
  }
}
