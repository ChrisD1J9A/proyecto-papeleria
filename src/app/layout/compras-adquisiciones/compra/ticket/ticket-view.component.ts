import { Component, OnInit } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {
  tittle = 'sampleapp'
  public page = 2;
  public pageLabel!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
