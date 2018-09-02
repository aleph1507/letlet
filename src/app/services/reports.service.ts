import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonReport } from '../models/PersonReport.model';
import { VehicleReport } from '../models/VehicleReport.model';
import { ShreddingReport } from '../models/ShreddingReport';


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

}
