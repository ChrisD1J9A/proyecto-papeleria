import { Component, Output, EventEmitter, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UsuarioService } from 'src/app/administracion/servicios';
import { Solicitud } from 'src/app/administracion/modelos/papeleria/solicitud';
import { SolicitudesService } from 'src/app/administracion/servicios/papeleria/solicitudes.service';


declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isActive: boolean | undefined;
  collapsed!: boolean;
  showMenu!: string;
  pushRightClass!: string;

  habilitar: boolean = true;
  r: boolean = false;
  s: boolean = true;

permisosUsuario=false//125

  solicitudesPendiente: number;
  permisosU :any;
  perfil: any;
  idRegion: any
  idSucursal: any
  username= '';
  idEmpleado: any;
  flag = false;
  @ViewChild("page")
  page!: ElementRef;
  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    public router: Router,
    private renderer: Renderer2,
    private userService: UsuarioService,
    private solicitudService: SolicitudesService) {


      this.router.events.subscribe(val => {
          if (
              val instanceof NavigationEnd &&
              window.innerWidth <= 992 &&
              this.isToggled()
          ) {
              this.toggleSidebar();
          }
      });



  }

  ngOnInit() {
      this.isActive = false;
      this.collapsed = false;
      this.showMenu = '';
      this.pushRightClass = 'push-right';
      this.permisosU = JSON.parse(localStorage.getItem('permisos'));
      this.permisos()
      this.cuantasSolicitudesPendientesHay();

  }

  mostrarSidebar(){
    if(this.habilitar){
      this.addMyClass()
    }else{
      this.removeMyClass()
    }
    this.habilitar = (this.habilitar==true)? false: true;
  }

  addMyClass(){
    this.renderer.addClass(this.page.nativeElement, "toggled");
  }

  removeMyClass(){
    this.renderer.removeClass(this.page.nativeElement, "toggled");
  }

  sidebarDropdown(){

  }


  eventCalled() {
      this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
      if (element === this.showMenu) {
          this.showMenu = '0';
      } else {
          this.showMenu = element;
      }
  }

  toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.collapsedEvent.emit(this.collapsed);
  }/***124-130 */
  permisos(){
    let roles = JSON.parse(localStorage.getItem('roles')!);
    console.log(roles)
    /***
     * permisosUsuario=false//125
this.permisosPerfilTarea=true//126
this.permisosTarea=true//127
this.permisosSistema=true//128
this.permisosPuestos=true//129
this.permisosAreas=true//130
     */
    for(let i=0;i<roles.roles.length;i++){
      if(roles.roles[i].idSistema==2){//nombreTarea
        for(let j=0;j<roles.roles[i].hijos.length;j++){
          if(roles.roles[i].hijos[j].url=="usuariosComponent"){//roles.roles[i].hijos[j].id==14
            this.permisosUsuario=true
          }


        }
      }
    }

  //  return false;

  }
  autorizacionNuevaConsulta(): boolean{

    return true;

  }
  autorizacionNuevaConsultaIndividual(){


    return true;
  }
  autorizacionMisConsultas(): boolean{


    return true;

  }

  autorizacionSeguimiento(): boolean{


    return true;

  }
  autorizacionReportes(): boolean{

    return false;

  }
  autorizacionReportesIndividual(){


    return true;
  }
  autorizacionExtras(): boolean{


    return true;

  }
  isToggled(): boolean {
      const dom: any = document.querySelector('body');
      return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle('rtl');
  }

  isExpanded = true;
  showSubmenu: boolean = true;
  isShowing = true;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  tienePermiso(permiso: string){
    let a = this.permisosU.find(perm => perm.nombre == permiso);
    if(a != null){
      return true;
    }else{
      return false;
    }
  }

  //Metodo que sirve para saber la cantidad de solicitudes pendientes existen
  cuantasSolicitudesPendientesHay(){
    var pendientes: Solicitud[];
    this.solicitudService.getSolicitudes().subscribe(
      solis => {
          pendientes = solis.filter(sol => sol.estatus ==="Pendiente");
          this.solicitudesPendiente = pendientes.length;
      })
  }
}
