import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RequesterComponent } from '../requester/requester.component';
import { LoginComponent } from '../login/login.component';
import { ApprovalsComponent } from '../approvals/approvals.component';
import { StopListComponent } from '../stop-list/stop-list.component';
import { BadgesComponent } from '../badges/badges.component';
import { ResourcesComponent } from '../resources/resources.component';
import { ResourceComponent } from '../resources/resource/resource.component';
import { GatesComponent } from '../gates/gates.component';
import { GateComponent } from '../gates/gate/gate.component';
import { ReportsComponent } from '../reports/reports.component';
import { PersonReportComponent } from '../reports/person-report/person-report.component';
import { VehicleReportComponent } from '../reports/vehicle-report/vehicle-report.component';
import { VehicleBadgesComponent } from '../vehicle-badges/vehicle-badges.component';
import { VehicleStopListComponent } from '../vehicle-stop-list/vehicle-stop-list.component';
import { ShreddingReportComponent } from '../reports/shredding-report/shredding-report.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { BadgereportComponent } from '../reports/badgereport/badgereport.component';
import { VehiclebadgereportComponent } from '../reports/vehiclebadgereport/vehiclebadgereport.component';
import { RequestsReportComponent } from '../reports/requests-report/requests-report.component';

const appRoutes: Routes = [
   { path: '', component: DashboardComponent, pathMatch: 'full' },
   { path: 'requester', component: RequesterComponent, pathMatch: 'full' },
   { path: 'requester/:id', component: RequesterComponent },
   { path: 'login', component: LoginComponent },
   { path: 'dashboard', component: DashboardComponent},
   { path: 'approvals', component: ApprovalsComponent, pathMatch: 'full' },
   { path: 'approvals/:selectedradio', component: ApprovalsComponent, pathMatch: 'full' },
   { path: 'stop-list', component: StopListComponent },
   { path: 'badges', component: BadgesComponent, pathMatch: 'full' },
   { path: 'badges/edit/:id', component: BadgesComponent },
   { path: 'resources', component: ResourcesComponent, pathMatch: 'full' },
   { path: 'resources/:category', component: ResourceComponent },
   { path: 'gates', component: GatesComponent, pathMatch: 'full' },
   { path: 'gates/:id', component: GateComponent, pathMatch: 'full' },
   { path: 'reports', component: ReportsComponent, pathMatch: 'full' },
   { path: 'reports/personReport', component: PersonReportComponent, pathMatch: 'full'},
   { path: 'reports/vehicleReport', component: VehicleReportComponent, pathMatch: 'full'},
   { path: 'reports/shreddingReport', component: ShreddingReportComponent, pathMatch: 'full'},
   { path: 'vehicle-badges', component: VehicleBadgesComponent, pathMatch: 'full' },
   { path: 'vehicles-stop-list', component: VehicleStopListComponent, pathMatch: 'full' },
   { path: 'user-management', component: UserManagementComponent, pathMatch: 'full'},
   { path: 'reports/badgereport', component: BadgereportComponent, pathMatch: 'full' },
   { path: 'reports/vehiclebadgereport', component: VehiclebadgereportComponent, pathMatch: 'full' },
   { path: 'reports/requestsreport', component: RequestsReportComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
