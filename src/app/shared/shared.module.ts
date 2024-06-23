import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FooterComponent } from './components/footer/footer.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterControlComponent } from './components/filter-control/filter-control.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    TopBarComponent,
    SideBarComponent,
    FooterComponent,
    UsersTableComponent,
    PageTitleComponent,
    FilterControlComponent,
    LayoutComponent,
    DashboardComponent,
    LoadingIndicatorComponent,
    UnauthorizedComponent,
    
    
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    BsDropdownModule.forRoot(),
    SimplebarAngularModule,
    PaginationModule,
    ModalModule.forRoot(),
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgChartsModule,
    ToastModule,
    ReactiveFormsModule
    
    
    
  ],
  exports:[
    TopBarComponent,
    SideBarComponent,
    FooterComponent,
    BsDatepickerModule,
    FilterControlComponent,
    UsersTableComponent,
    PageTitleComponent,
    LoadingIndicatorComponent
    
  ],
  providers:[BsDatepickerConfig]
})
export class SharedModule { }
