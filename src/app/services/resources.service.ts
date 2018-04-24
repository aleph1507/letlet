import { Injectable } from '@angular/core';
import { Badge } from '../models/Badge.model';
import { Company } from '../models/Company';
import { Vehicle } from '../models/Vehicle.model';
import { Employee } from '../models/Employee';


class VisitorsBadges {

}

class Employees {
  employees: Employee[] = [
    {
      id: 1,
      name: 'emp1',
      email: 'emp1@emp.com'
    },
    {
      id: 2,
      name: 'emp2',
      email: 'emp2@emp.com'
    }
  ];

  getAllEmployees() {
    return this.employees;
  }

  getEmplyeeById(id: number){
    for(let i = 0; i<this.employees.length; i++)
      if(this.employees[i].id == id)
        return this.employees[i];
    return null;
  }

  addEmployee(employee: Employee){
    this.employees.push(employee);
  }

  deleteEmployeeById(id: number){
    for(let i = 0; i<this.employees.length; i++)
      if(this.employees[i].id == id){
        this.employees.splice(i, 1);
        return 0;
      }
    return null;
  }

  editEmployeeById(emp: Employee){
    console.log('editEmployeeByID employee: ', emp);
    for(let i = 0; i<this.employees.length; i++){
      if(this.employees[i].id == emp.id){
        this.employees[i] = emp;
        // console.log('employee edited: ', this.employees[i]);
        return 0;
      }
    }
    return null;
  }
}

class Vehicles {
  vehicles: Vehicle[] = [
    {
      model: 'zastava',
      plate: 'sk-123-qw'
    },
    {
      model: 'varburg',
      plate: 've-666-zx'
    },
  ];

  addVehicle(vehicle: Vehicle){
    console.log('add vehicle: ', vehicle);
    this.vehicles.push(vehicle);
    console.log('postadd vehicles: ', this.vehicles);
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

  setVehicles(vehicles: Vehicle[]){
    this.vehicles = vehicles;
  }

  getVehicleByPlate(plate) {
    for(let i = 0; i<this.vehicles.length; i++){
      if(this.vehicles[i].plate == plate)
        return { vehicle: this.vehicles[i], index: i }
    }
    return null;
  }
}

class Companies {
  // companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  companies: Company[] = [
    {
      id: 1,
      name: 'AMC'
    },
    {
      id: 2,
      name: 'BBC'
    },
    {
      id: 3,
      name: 'TAV'
    },
    {
      id: 4,
      name: 'DrinkerLab'
    }
  ];

  getCompanies() {
    return this.companies;
  }

  getCompaniesNames() {
    let compNames = [];
    for(let i = 0; i<this.companies.length; i++)
      compNames.push(this.companies[i].name);

    return compNames;
  }

  getCompanyById(id: number) {
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].id == id)
        return this.companies[i];
    return null;
  }

  addCompany(company: Company) {
    this.companies.push(company);
    console.log('add company: ', company);
    console.log('companies: ', this.companies);
  }

  editCompany(id: number, name: string){
    // this.companies[index].name = name;
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].id == id){
        // console.log('name: ', name);
        // console.log('edit company: ', this.companies[i]);
        this.companies[i].name = name;
        // console.log('companies postedit: ', this.companies);
        // return this.companies[i];
      }
    return null;
  }

  getCompanyByIndex(index: number){
    return this.companies[index];
  }

  getCompanyByName(name: string){
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].name == name)
        return this.companies[i];
    return null;
  }

  deleteCompanyByIndex(index: number){
    return this.companies.splice(index, 1);
  }

  deleteCompanyByName(name: string) {
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].name == name)
        return this.companies.splice(i, 1);
    return null;
  }
}

@Injectable()
export class ResourcesService {
  // companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  companies = new Companies();
  vehicles = new Vehicles();
  employees = new Employees();
  badges: Badge[] = [];
  zones = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() { }

  getZones() {
    return this.zones;
  }

  setZones(zones: number[]) {
    this.zones = zones;
  }

  setBadges(badges: Badge[]) {
    this.badges = badges;
  }

  getBadges(){
    return this.badges;
  }

}
