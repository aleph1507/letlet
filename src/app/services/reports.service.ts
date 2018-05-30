import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonReport } from '../models/PersonReport.model';

@Injectable()
export class ReportsService {

  personsReportUrl = this.authService.baseUrl + '/api/visits/personreport';

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getReports(rUrl : string) : Observable<PersonReport[]> {
    return this.http.get<PersonReport[]>(rUrl, this.httpOptions);
  }

}
