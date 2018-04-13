import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RequesterComponent } from '../requester/requester.component';

const appRoutes: Routes = [
   { path: '', component: DashboardComponent, pathMatch: 'full' },
   { path: 'requester', component: RequesterComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
