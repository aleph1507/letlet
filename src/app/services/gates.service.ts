import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ResourcesService } from './resources.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExpectedPerson } from '../models/ExpectedPerson.model';
import { Observable } from 'rxjs';
import { EnteredPerson } from '../models/EnteredPerson.model';
import { ExpectedVehicle } from '../models/ExpectedVehicle.model';
import { EnteredVehicle } from '../models/EnteredVehicles.model';

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

  getAllEnteredPersons() : Observable<EnteredPerson[]> {
    return this.http.get<EnteredPerson[]>(this.enteredPersonsUrl, this.httpOptions);
  }

  getAllExpectedVehicles() : Observable<ExpectedVehicle[]> {
    return this.http.get<ExpectedVehicle[]>(this.expectedVehiclesUrl, this.httpOptions);
  }

  getAllEnteredVehicles() : Observable<EnteredVehicle[]> {
    return this.http.get<EnteredVehicle[]>(this.enteredVehiclesUrl, this.httpOptions);
  }


}
