import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonReport } from '../models/PersonReport.model';
import { VehicleReport } from '../models/VehicleReport.model';
import { ShreddingReport } from '../models/ShreddingReport';
import { VehicleBadgeReport } from '../models/VehicleBadgeReport';
import { BadgeReport } from '../models/BadgeReport';


@Injectable()
export class ReportsService {

  personsReportUrl = this.authService.baseUrl + '/api/visits/personreport';
  vehicleReportUrl = this.authService.baseUrl + '/api/visits/vehiclereport';

  showReports = ['All', 'Vehicles', 'Persons'];

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getReports(rUrl : string) : Observable<PersonReport[]> {
    return this.http.get<PersonReport[]>(rUrl, this.httpOptions);
  }

  getShreddingsReports(rUrl: string) : Observable<ShreddingReport[]> {
    return this.http.get<ShreddingReport[]>(rUrl);
  }

  getVehicleReports(rUrl: string): Observable<VehicleReport[]> {
    return this.http.get<VehicleReport[]>(rUrl, this.httpOptions);
  }

  getVehicleBadgesReports(rUrl: string): Observable<VehicleBadgeReport[]> {
    // let vbr = new VehicleBadgeReport();
    // vbr.permitNumber = 'PN1';
    // vbr.expireDate = new Date();
    // vbr.payment = 'pay1';
    // vbr.returned = false;
    // vbr.deactivated = true;
    // vbr.deactivateReason = 'dR1';
    // vbr.shreddingDate = new Date();
    // vbr.vehicleModel = 'model1';
    // vbr.vehiclePlate = 'SK-666-FK';
    // vbr.companyName = 'C1';
    // vbr.companyNameEn = 'C1en';
    // return Observable.of([vbr]);
    // permitNumber: string;
    // expireDate: Date;
    // payment: string;
    // returned: boolean;
    // deactivated: boolean;
    // deactivateReason: string;
    // shreddingDate: Date;
    // vehicleModel: string;
    // vehiclePlate: string;
    // companyName: string;
    // companyNameEn: string;
    return this.http.get<VehicleBadgeReport[]>(rUrl);
  }

  getBadgesReports(rUrl: string): Observable<BadgeReport[]> {
    // let br: BadgeReport = new BadgeReport();
    // br.badgeNumber = 'BN1';
    // br.cardSeriesNumber = 'CSN1';
    // br.cardNumber = 'CN1';
    // br.dateOfActivation = new Date();
    // br.dateOfSecurityCheck = new Date();
    // br.dateOfTraining = new Date();
    // br.expireDate = new Date();
    // br.payment = 'pay1';
    // br.deactivated = true;
    // br.deactivateReason = 'dR1';
    // br.shreddingDate = new Date();
    // br.returned = false;
    // br.employeeName = 'emp1';
    // br.employeeSurname = 'emps1';
    // br.occupation = 'occ1';
    // br.companyName = 'C1';
    // br.companyNameEn = 'C1en';
    // return Observable.of([br]);

    return this.http.get<BadgeReport[]>(rUrl);
  }

}
