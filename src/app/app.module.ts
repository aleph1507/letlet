import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { MatModule } from './modules/mat.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './modules/app-router.module';
import { RequesterComponent } from './requester/requester.component';
import { DialogPersonComponent } from './requester/dialog-person/dialog-person.component';
import { DialogVehicleComponent } from './requester/dialog-vehicle/dialog-vehicle.component';
import { RequesterService } from './services/requester.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ApprovalsComponent } from './approvals/approvals.component';
import { ApprovalsService } from './services/approvals.service';
import { FormsModule } from '@angular/forms';
import { StopListComponent } from './stop-list/stop-list.component';
import { StopListService } from './services/stop-list.service';
import { AgGridModule } from 'ag-grid-angular';
import { BadgesComponent } from './badges/badges.component';
import { ResourcesService } from './services/resources.service';
import { BadgesService } from './services/badges.service';
import { BadgesCreateComponent } from './badges/badges-create/badges-create.component';
import { ResourcesComponent } from './resources/resources.component';
import { ResourceComponent } from './resources/resource/resource.component';
import { CompanyModalComponent } from './resources/resource/company-modal/company-modal.component';
import { EmployeeModalComponent } from './resources/resource/employee-modal/employee-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RequesterComponent,
    DialogPersonComponent,
    DialogVehicleComponent,
    LoginComponent,
    ApprovalsComponent,
    StopListComponent,
    BadgesComponent,
    BadgesCreateComponent,
    ResourcesComponent,
    ResourceComponent,
    CompanyModalComponent,
    EmployeeModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    DialogPersonComponent,
    DialogVehicleComponent,
    BadgesCreateComponent,
    CompanyModalComponent,
    EmployeeModalComponent
  ],
  providers: [RequesterService, AuthService, ApprovalsService,
              StopListService, ResourcesService, BadgesService,
              DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
