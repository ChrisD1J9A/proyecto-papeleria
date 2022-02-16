import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { UnidadComponent} from './layout/catalogo/configuraciones/unidad/unidad.component';
import {UnidadService} from './layout/catalogo/configuraciones/unidad/unidad.service';
import {ProductosService} from './layout/catalogo/productos/productos.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

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
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { ProveedoresService } from './layout/catalogo/proveedores/proveedores.service';
import { ProveedorFormComponent } from './layout/catalogo/proveedores/proveedor-form.component';
import { SolicitudesComponent } from './layout/solicitudes/solicitudes.component';
import { SolicitudFormComponent } from './layout/solicitudes/solicitudForm/solicitud-form.component';
import { SolicitudFViewComponent } from './layout/solicitudes/solicitud/solicitud-fview.component';
import { SolicitudesAdquisicionesComponent } from './layout/solicitudes-adquisiciones/solicitudes-adquisiciones.component';
import { SolicitudAdqViewComponent } from './layout/solicitudes-adquisiciones/solicitud/solicitud-adq-view.component';
import { ComprasComponent } from './layout/compras/compras.component';
import { CompraFViewComponent } from './layout/compras/compra/compra-fview.component';

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
    MatTabsModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    UnidadService,
    ProductosService,
    ProveedoresService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
