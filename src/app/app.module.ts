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

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RequesterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
