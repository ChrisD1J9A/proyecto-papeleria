import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UnidadComponent} from './layout/catalogo/configuraciones/unidad/unidad.component';
import { ComprasService } from './administracion/servicios/papeleria/compras.service';
import { DetalleCompraPFDCService } from './administracion/servicios/papeleria/detalle-compra-pfdc.service';
import { DetalleCompraService } from './administracion/servicios/papeleria/detalle-compra.service';
import { DetalleInventarioService } from './administracion/servicios/papeleria/detalle-inventario.service';
import { DetalleSolicitudService } from './administracion/servicios/papeleria/detalle-solicitud.service';
import { DetalleSolicitudPFDCService } from './administracion/servicios/papeleria/detalle-solicitud-pfdc.service';
import { InventarioService } from './administracion/servicios/papeleria/inventario.service';
import { MailService } from './administracion/servicios/papeleria/mail.service';
import { MaxMinExistenciaService } from './administracion/servicios/papeleria/max-min-existencia.service';
import { MaxMinStockService } from './administracion/servicios/papeleria/max-min-stock.service';
import { ProveedoresService } from './administracion/servicios/papeleria/proveedores.service';
import { SolicitudesService } from './administracion/servicios/papeleria/solicitudes.service';
import {UnidadService} from './administracion/servicios/papeleria/unidad.service';
import {ProductosService} from './administracion/servicios/papeleria/productos.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule } from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field/';
import {MatInputModule} from '@angular/material/input'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon'
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatStepperModule} from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component'
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProductosComponent } from './layout/catalogo/productos/productos.component';
import { ProductoFormComponent } from './layout/catalogo/productos/producto-form.component';
import { ProveedoresComponent } from './layout/catalogo/proveedores/proveedores.component';
import { ProveedorFormComponent } from './layout/catalogo/proveedores/proveedor-form.component';
import { SolicitudesComponent } from './layout/solicitudes/solicitudes.component';
import { SolicitudFormComponent } from './layout/solicitudes/solicitudForm/solicitud-form.component';
import { SolicitudFViewComponent } from './layout/solicitudes/solicitud/solicitud-fview.component';
import { SolicitudesAdquisicionesComponent } from './layout/solicitudes-adquisiciones/solicitudes-adquisiciones.component';
import { SolicitudAdqViewComponent } from './layout/solicitudes-adquisiciones/solicitud/solicitud-adq-view.component';
import { ComprasComponent } from './layout/compras/compras.component';
import { CompraFViewComponent } from './layout/compras/compra/compra-fview.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComprasAdquisicionesComponent } from './layout/compras-adquisiciones/compras-adquisiciones.component';
import { CompraAdqViewComponent } from './layout/compras-adquisiciones/compra/compra-adq-view.component';
import { InventarioComponent } from './layout/inventario/inventario.component';
import { MaxMinDeStockComponent } from './layout/catalogo/configuraciones/maxMinDeStock/max-min-de-stock/max-min-de-stock.component';
import { MaxMinDeExistenciaComponent } from './layout/catalogo/configuraciones/maxMinDeStock/max-min-de-existencia/max-min-de-existencia.component';
import { InventariosAdquisicionesComponent } from './layout/inventarios-adquisiciones/inventarios-adquisiciones.component';
import { TicketViewComponent } from './layout/compras-adquisiciones/compra/ticket/ticket-view.component';
import { ReportesViewComponent } from './layout/compras-adquisiciones/reportes/reportes-view.component';
import { ProductosFDCViewComponent } from './layout/catalogo/productos/productosFueraDeCatalogo/productos-fdcview.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    HomeComponent,
    UnidadComponent,
    ProductosComponent,
    ProductoFormComponent,
    ProveedoresComponent,
    ProveedorFormComponent,
    SolicitudesComponent,
    SolicitudFormComponent,
    SolicitudFViewComponent,
    SolicitudesAdquisicionesComponent,
    SolicitudAdqViewComponent,
    ComprasComponent,
    CompraFViewComponent,
    ComprasAdquisicionesComponent,
    CompraAdqViewComponent,
    InventarioComponent,
    MaxMinDeStockComponent,
    MaxMinDeExistenciaComponent,
    InventariosAdquisicionesComponent,
    TicketViewComponent,
    ReportesViewComponent,
    ProductosFDCViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTableExporterModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSnackBarModule,
    PdfViewerModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    UnidadService,
    ProductosService,
    ProveedoresService,
    ComprasService,
    DetalleCompraPFDCService,
    DetalleCompraService,
    DetalleInventarioService,
    DetalleSolicitudService,
    DetalleSolicitudPFDCService,
    InventarioService,
    MailService,
    MaxMinExistenciaService,
    MaxMinStockService,
    ProveedoresService,
    SolicitudesService,
    DecimalPipe,
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
