import { Injectable } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Requester } from '../models/Requester.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ResourcesService } from './resources.service';
import { Company } from '../models/Company';
import 'rxjs/Rx';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class RequesterService {

  comp1: Company = null;
  comp2: Company = null;

  requestUrl = this.authService.baseUrl + '/api/requests';

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  persons: Person[] = [];

  vehicles: Vehicle[] = [];
  requests: Requester[] = [];


  constructor(private http: HttpClient,
              private resourcesService: ResourcesService,
              private authService: AuthService,
              private router: Router) { }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  throw Error(
    'Something bad happened; please try again later.');
};

  getRequest(id: number) : Observable<Requester>{
    return this.http.get<Requester>(this.requestUrl + '/' + id, this.httpOptions);
  }

  pushRequest(id = null, requesterName, contactEmail, contactPhone, description, descriptionEn, company : Company, fromDate, toDate, numberOfEntries, pdf1 = null, pdf2 = null, personPay, vehiclePay){
    let request = new Requester();
    request.id = id;
    request.requesterName = requesterName;
    request.contactEmail = contactEmail,
    request.contactPhone = contactPhone,
    request.description = description;
    request.descriptionEn = descriptionEn,
    request.companyId = company.id;
    request.fromDate = fromDate;
    request.toDate = toDate;
    request.numberOfEntries = numberOfEntries;
    request.requestPersonJson = this.persons;
    request.requestVehicleJson = this.vehicles;
    request.pdf1 = pdf1;
    request.pdf2 = pdf2;
    request.personPay = personPay;
    request.vehiclePay = vehiclePay;
    this.persons = [];
    this.vehicles = [];

    return this.http.post(this.requestUrl, request, this.httpOptions);
  }

  approveRequest(id: number) : Observable<boolean>{
    return this.http.post<boolean>(this.requestUrl + '/approve/' + id, {}, this.httpOptions);
  }

  declineRequest(id: number) : Observable<boolean>{
    return this.http.post<boolean>(this.requestUrl + '/decline/' + id, {}, this.httpOptions);
  }

  switchRequest(req0: Requester, req1: Requester) {
    for(let i = 0; i<this.requests.length; i++){
      if(this.requests[i].id == req0.id){
        this.requests.splice(i, 1, req1);
      }
    }
  }

  editRequest(req: Requester) {
    console.log('vo service editRequest');
    return this.http.patch(this.requestUrl + '/' + req.id, req);
  }

  addPerson(person: Person){
    this.persons.push(person);
  }

  getAllRequests(){
    return this.requests;
  }

  getNumberRequests(){
    return this.requests.length;
  }

  getPersonByIndex(index:number) {
    return this.persons[index];
  }

  getAllPersons(): Person[]{
    return this.persons;
  }

  getNumberPersons() {
    return this.persons.length;
  }

  getNumberVehicles() {
    return this.vehicles.length;
  }

  editPerson(index: number, person: Person) {
    this.persons[index] = person;
    return this.persons[index];
  }

  deletePerson(index: number) {
    this.persons.splice(index, 1);
  }

  addVehicle(vehicle: Vehicle){
    this.vehicles.push(vehicle);
  }

  getVehicleByIndex(index: number) {
    return this.vehicles[index];
  }

  getAllVehicles(): Vehicle[]{
    return this.vehicles;
  }

  editVehicle(index: number, vehicle: Vehicle) {
    this.vehicles[index] = vehicle;
    return this.vehicles[index];
  }

  deleteVehicle(index: number) {
    this.vehicles.splice(index, 1);
  }

  setPersons(persons: Person[]){
    this.persons = persons;
  }

  setVehicles(vehicles: Vehicle[]){
    this.vehicles = vehicles;
  }

  isEmptyPersons(){
    return this.persons.length === 0;
  }

  getPdf(which, rid){ ///api/requests/pdf1/{requestId} 11-blob
    // return this.http.get(this.authService.baseUrl + '/api/requests/pdf1' + which + '/' + rid);
    // return this.http.get(this.authService.baseUrl + '/api/requests/pdf' + which + '/' + rid,
    //     { responseType: 'blob' }).map((res) => {
    //       return new Blob([res], { type: 'application/pdf' })
    //     });
    return this.http.get(this.authService.baseUrl + '/api/requests/pdf' + which + '/' + rid, {responseType: 'arraybuffer'});
    //     { responseType: 'blob' }).map((res) => {
    //       return new Blob([res], { type: 'application/pdf' })
    //     });

  }

}
