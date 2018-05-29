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
import { ReasonModalComponent } from './resources/resource/reason-modal/reason-modal.component';
import { GateModalComponent } from './resources/resource/gate-modal/gate-modal.component';
import { OccupationModalComponent } from './resources/resource/occupation-modal/occupation-modal.component';
import { AirportZoneModalComponent } from './resources/resource/airport-zone-modal/airport-zone-modal.component';
import { VisitorBadgeModalComponent } from './resources/resource/visitor-badge-modal/visitor-badge-modal.component';
import { VisitorVehicleBadgeModalComponent } from './resources/resource/visitor-vehicle-badge-modal/visitor-vehicle-badge-modal.component';
import { DialogResourceVehicleComponent } from './resources/resource/dialog-vehicle/dialog-vehicle.component';
import { GatesComponent } from './gates/gates.component';
import { GatesService } from './services/gates.service';
import { GateComponent } from './gates/gate/gate.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RequesterComponent,
    DialogPersonComponent,
    DialogVehicleComponent,
    DialogResourceVehicleComponent,
    LoginComponent,
    ApprovalsComponent,
    StopListComponent,
    BadgesComponent,
    BadgesCreateComponent,
    ResourcesComponent,
    ResourceComponent,
    CompanyModalComponent,
    EmployeeModalComponent,
    ReasonModalComponent,
    GateModalComponent,
    OccupationModalComponent,
    AirportZoneModalComponent,
    VisitorBadgeModalComponent,
    VisitorVehicleBadgeModalComponent,
    GatesComponent,
    GateComponent,
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
    EmployeeModalComponent,
    ReasonModalComponent,
    GateModalComponent,
    OccupationModalComponent,
    AirportZoneModalComponent,
    VisitorBadgeModalComponent,
    VisitorVehicleBadgeModalComponent,
    DialogResourceVehicleComponent
  ],
  providers: [RequesterService, AuthService, ApprovalsService,
              StopListService, ResourcesService, BadgesService,
              DatePipe, GatesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
