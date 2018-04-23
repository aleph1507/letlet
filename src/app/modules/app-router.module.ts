import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RequesterComponent } from '../requester/requester.component';
import { LoginComponent } from '../login/login.component';
import { ApprovalsComponent } from '../approvals/approvals.component';
import { StopListComponent } from '../stop-list/stop-list.component';
import { BadgesComponent } from '../badges/badges.component';

const appRoutes: Routes = [
   { path: '', component: DashboardComponent, pathMatch: 'full' },
   { path: 'requester', component: RequesterComponent, pathMatch: 'full' },
   { path: 'requester/edit/:id', component: RequesterComponent },
   { path: 'login', component: LoginComponent },
   { path: 'dashboard', component: DashboardComponent},
   { path: 'approvals', component: ApprovalsComponent },
   { path: 'stop-list', component: StopListComponent },
   { path: 'badges', component: BadgesComponent, pathMatch: 'full' },
   { path: 'badges/edit/:id', component: BadgesComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
