import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ADMINISTRACION';
  username:any
  constructor(private router: Router) {
 
  
  }
  ngOnInit(): void {

 //  this.router.navigate(['login']);
 //  this.username=JSON.parse(localStorage.getItem('currentUser')!).username;
  // console.log(this.username)

  
  }
}
