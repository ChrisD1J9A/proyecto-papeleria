import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  ticket: string;
}

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {
  ticket: string;
  esPdf: boolean;

  constructor(public dialogRef: MatDialogRef<TicketViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData
            ) { this.tipoArchivo();}

  ngOnInit(): void {
  }

  tipoArchivo()
  {
    if(this.data.ticket.endsWith(".pdf")===true)
    {
      this.esPdf = true;
    }else{
      this.esPdf = false;
    }
  }
}
