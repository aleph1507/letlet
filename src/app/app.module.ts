import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    DialogVehicleComponent
  ],
  providers: [RequesterService, AuthService, ApprovalsService,
              StopListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
