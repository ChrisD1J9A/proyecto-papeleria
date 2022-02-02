import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    usuario : any ="";
    @Output() toggleSidebarForMe: EventEmitter<string> = new EventEmitter();


    constructor(public router: Router) { }
      ngOnInit(): void {
      //this.usuario= JSON.parse(localStorage.getItem('currentUser')!);
      //console.log(this.usuario.username);

     }
    toggleSidebar() {
        this.toggleSidebarForMe.emit();
    }
    cerrarSesion(){
      Swal.fire("cerrando sesion")
      // Swal.close();
       localStorage.setItem("sucursalIngresa","");
       localStorage.setItem("roles","");
       localStorage.setItem("currentUser","");
      this.router.navigate(["/login"]);
    }

}
