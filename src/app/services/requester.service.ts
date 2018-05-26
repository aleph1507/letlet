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

@Injectable()
export class RequesterService {

  comp1: Company = null;
  comp2: Company = null;

  requestUrl = 'http://192.168.100.4:84/api/requests';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + 'RhLV2Xd_l5NPR9XEKzIuThoXcUdHLnKhTZqykf96kzMQqNBRZJPc26ZIHNBEjXgVrVgsWSGrk6a0iR1S1RwB7uoUAUfeiWZGnYKGlLoYcll3q0OrDX3HdnEOYd24D0eYkSkWR9s_YJSAnOtNXduNliRZMwY5OXy27UTPdxYAKSe1GMgiyJudlaLl2858EZ4x5EH05B5CySoHn_DizrsNO6RkVZczJvWicarx3AjUkHHGdZZYS5EkvfZ54T01CdCn1pGy6rnJMOrgUPzOtW_6ILsYcr1NlSThyJxWbeNUBxCAlUaV7FQFv_Krl9ZasSZ8g5x5GTTORIY0FvGrk7Kbu6rbkIJjPnZbX0xDVjdDGwW0HI_Y8L0Cjo-iQ2TjWHy3MlvGmogRQhxy-WpA0fCm-A',
      'Accept': 'application/json'
    })
  }

  persons: Person[] = [
      {
        nameEn: 'name1',
        name: 'наме1',
        surnameEn: 'surname1',
        surname: 'сурнаме1',
        image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'

      },
      {
        nameEn: 'name2',
        name: 'наме2',
        surnameEn: 'surname2',
        surname: 'сурнаме2',
        image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
        image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'

      },
      {
        nameEn: 'name3',
        name: 'наме3',
        surnameEn: 'surname3',
        surname: 'сурнаме3',
        image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'

      },
      {
        nameEn: 'name4',
        name: 'наме4',
        surnameEn: 'surname4',
        surname: 'сурнаме4',
        image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
        image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'

      },
    ];
  vehicles: Vehicle[] = [
    {
      id: null,
      model: 'zastava',
      plate: 'sk-123-qw'
    },
    {
      id: null,
      model: 'varburg',
      plate: 've-666-zx'
    },
  ];
  requests: Requester[] = [];


  constructor(private http: HttpClient,
              private resourcesService: ResourcesService) { }

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

  dlRequest() {
    return this.http.get<Requester>(this.requestUrl);
  }

  pushRequest(id = null, requesterName, description, company : Company, fromDate, toDate, numberOfEntries){
    let request = new Requester();
    // request.requestID = this.requests.length;
    request.id = id;
    request.requesterName = requesterName;
    request.description = description;
    request.companyId = company.id;
    request.fromDate = fromDate;
    request.toDate = toDate;
    request.numberOfEntries = numberOfEntries;
    request.requestPersonJson = this.persons;
    request.requestVehicleJson = this.vehicles;
    // request.date = Date.now();
    this.persons = [];
    this.vehicles = [];

    // this.requests.push(request);
    this.http.post(this.requestUrl, request, this.httpOptions)
      .subscribe((data : Requester) => {
        this.requests.push(data);
      });
  }

  editRequest(req: Requester){
    for(let i = 0; i<this.requests.length; i++){
      if(this.requests[i].id == req.id){
        this.requests[i] = req;
        break;
      }
    }
  }

  addPerson(person: Person){
    this.persons.push(person);
  }

  getAllRequests(){
    return this.requests;
  }

  getRequest(index: number) {
    return this.requests[index];
  }

  getNumberRequests(){
    return this.requests.length;
  }

  getPersonByIndex(index:number) {
    return this.persons[index];
  }

  getAllPersons(){
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

  getAllVehicles(){
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
