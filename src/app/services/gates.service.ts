import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ResourcesService } from './resources.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExpectedPerson } from '../models/ExpectedPerson.model';
import { Observable } from 'rxjs';

@Injectable()
export class GatesService {

  gatesUrl = this.authService.baseUrl + '/api/gates';
  expectedPersonsUrl = this.authService.baseUrl + '/api/requests/expectedPersons';
  expectedVehiclesUrl = this.authService.baseUrl + '/api/requests/expectedVehicles';
  enteredPersonsUrl = this.authService.baseUrl + '/api/visits/entered/person';
  enteredVehiclesUrl = this.authService.baseUrl + '/api/visits/entered/vehicles';

  // headers : HttpHeaders = this.authService.getHeaders();

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  headers = this.authService.getHeaders();

  constructor(private authService: AuthService,
              private resourcesService: ResourcesService,
              private http: HttpClient) { }


  getAllExpectedPersons() : Observable<ExpectedPerson[]> {
    return this.http.get<ExpectedPerson[]>(this.expectedPersonsUrl, this.httpOptions);
  }




}
