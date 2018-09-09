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

  // requestUrl = 'http://192.168.100.4:84/api/requests';
  requestUrl = this.authService.baseUrl + '/api/requests';

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer ' + 'OVdSQO8unD8O7jCsDBBqNnmbiLHbtR5h7jg_iA3SP8Wxc7TPFkcxXgy7TO5WZX9vBdD_GxDM0jtFMpzSTlx8Ooe5jNhbyflfYCZPfswkLY4POCso_ysWeUg_98y_8sWQvFVnkbmNRWKRqHCmLzOhGRrVjduJ8ORgTk3eScYc_R2fpiGHE1KBvfzPnuSOhvgpIFy-1B-FlxmZwbNz3wloSHHtklUdRkfelAZSKBGBJ5MH3dxgnbsau22Qm8muhXCE09FplfiqFq5B7KNMjEDd6vh-T0MQG8aDoARGVqA-VHwFShUvFKmY_4sjvmaCNYRAfbQf4c_wPdkmR6vqhYePAUK3oDI-50dQfgdGkBNcQN8aamujiKouRhnNSNRuXZ81s_MAdcBqyIrwJdc7khG6tg',
  //     'Accept': 'application/json'
  //   })
  // }

  persons: Person[] = [];
      // {
      //   nameEn: 'name1',
      //   name: 'наме1',
      //   surnameEn: 'surname1',
      //   surname: 'сурнаме1',
      //   image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
      //   image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'
      //
      // },
      // {
      //   nameEn: 'name2',
      //   name: 'наме2',
      //   surnameEn: 'surname2',
      //   surname: 'сурнаме2',
      //   image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
      //   image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'
      //
      // },
      // {
      //   nameEn: 'name3',
      //   name: 'наме3',
      //   surnameEn: 'surname3',
      //   surname: 'сурнаме3',
      //   image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
      //   image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'
      //
      // },
      // {
      //   nameEn: 'name4',
      //   name: 'наме4',
      //   surnameEn: 'surname4',
      //   surname: 'сурнаме4',
      //   image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
      //   image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'
      //
      // },
    // ];

    vehicles: Vehicle[] = [];
  // vehicles: Vehicle[] = [
  //   {
  //     id: null,
  //     model: 'zastava',
  //     plate: 'sk-123-qw'
  //   },
  //   {
  //     id: null,
  //     model: 'varburg',
  //     plate: 've-666-zx'
  //   },
  // ];
  requests: Requester[] = [];


  constructor(private http: HttpClient,
              private resourcesService: ResourcesService,
              private authService: AuthService,
              private router: Router) { }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
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
    // request.requestID = this.requests.length;
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
    // request.date = Date.now();
    console.log(request);
    this.persons = [];
    this.vehicles = [];


    // this.requests.push(request);

    return this.http.post(this.requestUrl, request, this.httpOptions);
    // this.http.post(this.requestUrl, request, this.httpOptions)
    //   .subscribe((data : Requester) => {
    //     this.requests.push(data);
    //     this.router.navigate(['/approvals', 1]);
    //   });
  }

  approveRequest(id: number) : Observable<boolean>{
    return this.http.post<boolean>(this.requestUrl + '/approve/' + id, {}, this.httpOptions);
  }

  declineRequest(id: number) : Observable<boolean>{
    return this.http.post<boolean>(this.requestUrl + '/decline/' + id, {}, this.httpOptions);
  }


  // editRequest(req: Requester){
  //   for(let i = 0; i<this.requests.length; i++){
  //     if(this.requests[i].id == req.id){
  //       this.requests[i] = req;
  //       break;
  //     }
  //   }
  // }

  switchRequest(req0: Requester, req1: Requester) {
    for(let i = 0; i<this.requests.length; i++){
      if(this.requests[i].id == req0.id){
        this.requests.splice(i, 1, req1);
      }
    }
  }

  editRequest(req: Requester) {
    console.log('vo requester service editRequest req: ', req);
    // req.pdf1 = null;
    // req.pdf2 = null;
    return this.http.patch(this.requestUrl + '/' + req.id, req);
    // this.http.patch(this.requestUrl + '/' + req.id, req)
    //   .subscribe((data : Requester) => {
    //     for(let i = 0; i<this.requests.length; i++){
    //       if(this.requests[i].id == req.id){
    //         this.requests.splice(i, 1, data);
    //       }
    //     }
    //     // this.requests.push(data);
    //     // this.router.navigate(['/requester', req.id]);
    //     // this._location.back()
    //   });
  }

  addPerson(person: Person){
    this.persons.push(person);
  }

  getAllRequests(){
    return this.requests;
  }

  // getRequest(index: number) {
  //   return this.requests[index];
  // }

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
    console.log("delete person");
    this.persons.splice(index, 1);
    console.log(this.persons);
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

}
