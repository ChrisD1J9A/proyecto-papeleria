import { Component, OnInit } from '@angular/core';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {

    constructor() {}
    username: any 
    ngOnInit() {
        this.username=JSON.parse(localStorage.getItem('currentUser')!).username;
    }
    
}
