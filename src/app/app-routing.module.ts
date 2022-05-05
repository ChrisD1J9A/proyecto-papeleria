import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Municipios } from './administracion/servicios/municipios';
import { HomeComponent } from './home';
import { LayoutComponent } from './layout/layout.component';
import { SolicitudesComponent } from './layout/solicitudes/solicitudes.component';
import { SolicitudFViewComponent } from './layout/solicitudes/solicitud/solicitud-fview.component';
import { SolicitudFormComponent } from './layout/solicitudes/solicitudForm/solicitud-form.component';
import { SolicitudesAdquisicionesComponent } from './layout/solicitudes-adquisiciones/solicitudes-adquisiciones.component';
import { SolicitudAdqViewComponent } from './layout/solicitudes-adquisiciones/solicitud/solicitud-adq-view.component';
import { ComprasComponent } from './layout/compras/compras.component';
import { CompraFViewComponent} from './layout/compras/compra/compra-fview.component';
import { TicketViewComponent } from './layout/compras-adquisiciones/compra/ticket/ticket-view.component';
import { ComprasAdquisicionesComponent } from './layout/compras-adquisiciones/compras-adquisiciones.component';
import { ReportesViewComponent } from './layout/compras-adquisiciones/reportes/reportes-view.component';
import { CompraAdqViewComponent } from './layout/compras-adquisiciones/compra/compra-adq-view.component';
import { InventarioComponent } from './layout/inventario/inventario.component';
import { InventariosAdquisicionesComponent } from './layout/inventarios-adquisiciones/inventarios-adquisiciones.component';
import { LoginComponent } from './login/login.component';
import { UnidadComponent } from './layout/catalogo/configuraciones/unidad/unidad.component';
import { ProductosComponent } from './layout/catalogo/productos/productos.component';
import { ProductoFormComponent } from './layout/catalogo/productos/producto-form.component';
import { ProveedoresComponent } from './layout/catalogo/proveedores/proveedores.component';
import { ProveedorFormComponent } from './layout/catalogo/proveedores/proveedor-form.component';
import { MaxMinDeStockComponent } from './layout/catalogo/configuraciones/maxMinDeStock/max-min-de-stock/max-min-de-stock.component';
import { MaxMinDeExistenciaComponent } from './layout/catalogo/configuraciones/maxMinDeStock/max-min-de-existencia/max-min-de-existencia.component';
import { RolGuard } from './_guards';
import { AuthGuard } from './_guards/auth.guard';
import {PermisosGuard} from './_guards/permisos.guard';
import { Permisos } from './administracion/servicios/permisos';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'layout',
     children: [
      {
        path: '',  component: LayoutComponent , canActivate: [AuthGuard], canActivateChild:[PermisosGuard],
        children: [
         { path: '', component: HomeComponent },
         { path: 'solicitudes', component: SolicitudesComponent, data:{permiso:Permisos.SOLICITUDES}},
         { path: 'solicitudes/detalle_solicitud/:id', component: SolicitudFViewComponent},
         { path: 'solicitudes/solicitud-form', component: SolicitudFormComponent},
         { path: 'solicitudes-adquisiciones', component: SolicitudesAdquisicionesComponent, data:{permiso:Permisos.SOLICITUDESADQUISICIONES}},
         { path: 'solicitudes-adquisiciones/detalle_solicitud/:id', component: SolicitudAdqViewComponent},
         { path: 'compras', component: ComprasComponent, data:{permiso:Permisos.COMPRAS}},
         { path: 'compras/detalle_compra/:id', component: CompraFViewComponent},
         { path: 'compras/add/:id', component: CompraFViewComponent},
         { path: 'compras/show/:id', component: CompraFViewComponent},
         { path: 'compras-adquisiciones', component: ComprasAdquisicionesComponent, data:{permiso:Permisos.COMPRASADQUISICIONES}},
         { path: 'compras-adquisiciones/detalle_compra/:id', component: CompraAdqViewComponent},
         { path: 'compras-adquisiciones/detalle_compra/:id/ticket', component: TicketViewComponent},
         {path: 'compras-adquisiciones/reportes', component: ReportesViewComponent},
         { path: 'inventario', component: InventarioComponent, data:{permiso:Permisos.INVENTARIO}},
         { path: 'inventarios-adquisiciones', component: InventariosAdquisicionesComponent, data:{permiso:Permisos.INVENTARIOSADQUISICIONES}},
         { path: 'productos', component: ProductosComponent, data:{permiso:Permisos.PRODUCTOS}},
         { path: 'productos/producto-form', component: ProductoFormComponent},
         { path: 'productos/producto-form/:id', component: ProductoFormComponent},
         { path: 'proveedores', component: ProveedoresComponent, data:{permiso:Permisos.PROVEEDORES}},
         { path: 'proveedores/proveedor-form', component: ProveedorFormComponent},
         { path: 'proveedores/proveedor-form/:id', component: ProveedorFormComponent},
         { path: 'unidades', component: UnidadComponent, data:{permiso:Permisos.UNIDAD}},
         { path: 'maxMinStock', component: MaxMinDeStockComponent, data:{permiso:Permisos.MAXMINSTOCK}},
         { path: 'maxMinExistencia', component: MaxMinDeExistenciaComponent, data:{permiso:Permisos.MAXMINEXISTENCIA}},
        ]
      },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
