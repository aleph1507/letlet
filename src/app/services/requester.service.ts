import { Injectable } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

// @Injectable()
// export class PersonDataSource extends DataSource<any> {
//   constructor(public persons: Person[]) {
//     super();
//   }
//
//   connect(): Observable<any> {
//     return Observable.of(this.persons);
//   }
//
//   disconnect() {
//
//   }
// }

@Injectable()
export class RequesterService {

  persons: Person[] = [];
  vehicles: Vehicle[] = [];

  constructor() { }

  addPerson(person: Person){
    this.persons.push(person);
  }

  getPersonByIndex(index:number) {
    return this.persons[index];
  }

  getAllPersons(){
    return this.persons;
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

  isEmptyPersons(){
    return this.persons.length === 0;
  }

}
