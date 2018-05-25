import { Injectable } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Requester } from '../models/Requester.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ResourcesService } from './resources.service';
import { Company } from '../models/Company';

@Injectable()
export class RequesterService {

  comp1: Company = null;
  comp2: Company = null;

  requestUrl = 'http://192.168.100.4:84/api/entryrequest';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + 'FCTyLtiYAdyYf1gQ9OdwXWw9__dQgwCkov0zhTJHDHIOxWf1dkH-1_KlvCBAYbF0rOdmD3fYM7H5ZmP2Ri7SLDtAmFeN6rHakdiaEpb0tBEu22HGOFcckatmvWD5pTDYDCbVi5VAmJ88psa6d10gCkJYDY6HHJu-yb7-LPCl9lOXyTmDIw509Shcb1FdLZy-Tz0YCvChXWdeECRNMFc1B1AqnYrdVqxaHWScbYq4-7krCWyrvtvDtavroqMV9-jlp8jQHnie4RnwklJIVGm6QPesDWb1uevNenMEUdanBGiCw6cztXYUe4mXGL7aKI71pOib75Nwn0PjbXw9Uz-enBHSGpFxNExlN4v9o_zCtiMbU2kCgouNQzRTvQuloivPKRXGVri7OVkdHu7ZOfLehA',
      'Accept': 'application/json'
    })
  }

  persons: Person[] = [
      {
        name: 'name1',
        nameCyrilic: 'наме1',
        surname: 'surname1',
        surnameCyrilic: 'сурнаме1',
        image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'

      },
      {
        name: 'name2',
        nameCyrilic: 'наме2',
        surname: 'surname2',
        surnameCyrilic: 'сурнаме2',
        image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
        image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'

      },
      {
        name: 'name3',
        nameCyrilic: 'наме3',
        surname: 'surname3',
        surnameCyrilic: 'сурнаме3',
        image1: 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        image2: 'https://media.gettyimages.com/photos/close-up-profile-of-pensive-brunette-woman-picture-id522796409'

      },
      {
        name: 'name4',
        nameCyrilic: 'наме4',
        surname: 'surname4',
        surnameCyrilic: 'сурнаме4',
        image1: 'https://thumb9.shutterstock.com/display_pic_with_logo/1306012/561117598/stock-photo-beauty-woman-profile-face-portrait-beautiful-spa-model-girl-with-perfect-fresh-clean-skin-blonde-561117598.jpg',
        image2: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg'

      },
    ];
  vehicles: Vehicle[] = [
    {
      id: null,
      company: null,
      model: 'zastava',
      plate: 'sk-123-qw'
    },
    {
      id: null,
      company: null,
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

  pushRequest(requesterName, description, company, from, to, numEntries){
    let request = new Requester();
    request.requestID = this.requests.length;
    request.requesterName = requesterName;
    request.description = description;
    request.company = company;
    request.from = from;
    request.to = to;
    request.numEntries = numEntries;
    request.persons = this.persons;
    request.vehicles = this.vehicles;
    request.date = Date.now();
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
      if(this.requests[i].requestID == req.requestID){
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
