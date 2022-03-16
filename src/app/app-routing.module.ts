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
import { ComprasAdquisicionesComponent } from './layout/compras-adquisiciones/compras-adquisiciones.component';
import { CompraAdqViewComponent } from './layout/compras-adquisiciones/compra/compra-adq-view.component';
import { InventarioComponent } from './layout/inventario/inventario.component';
import { InventarioViewComponent } from './layout/inventario/inventario/inventario-view.component';
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

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'layout',
     children: [
      {
        path: '',  component: LayoutComponent ,
        children: [
         { path: '', component: HomeComponent },
         { path: 'solicitudes', component: SolicitudesComponent },
         { path: 'solicitudes/detalle_solicitud/:id', component: SolicitudFViewComponent},
         { path: 'solicitudes/solicitud-form', component: SolicitudFormComponent},
         { path: 'solicitudes-adquisiciones', component: SolicitudesAdquisicionesComponent},
         { path: 'solicitudes-adquisiciones/detalle_solicitud/:id', component: SolicitudAdqViewComponent},
         { path: 'compras', component: ComprasComponent},
         { path: 'compras/detalle_compra/:id', component: CompraFViewComponent},
         { path: 'compras/add/:id', component: CompraFViewComponent},
         { path: 'compras/show/:id', component: CompraFViewComponent},
         { path: 'compras-adquisiciones', component: ComprasAdquisicionesComponent},
         { path: 'compras-adquisiciones/detalle_compra/:id', component: CompraAdqViewComponent},
         { path: 'inventario', component: InventarioComponent},
         { path: 'inventario/detalle_inventario/:id', component: InventarioViewComponent},
         { path: 'productos', component: ProductosComponent},
         { path: 'productos/producto-form', component: ProductoFormComponent},
         { path: 'productos/producto-form/:id', component: ProductoFormComponent},
         { path: 'proveedores', component: ProveedoresComponent},
         { path: 'proveedores/proveedor-form', component: ProveedorFormComponent},
         { path: 'proveedores/proveedor-form/:id', component: ProveedorFormComponent},
         { path: 'unidades', component: UnidadComponent},
         { path: 'maxMinStock', component: MaxMinDeStockComponent},
         { path: 'maxMinExistencia', component: MaxMinDeExistenciaComponent},
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
