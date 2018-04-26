import { Injectable } from '@angular/core';
import { Badge } from '../models/Badge.model';
import { Company } from '../models/Company';
import { Vehicle } from '../models/Vehicle.model';
import { Employee } from '../models/Employee';
import { Reason } from '../models/Reason';
import { Gate } from '../models/Gate';
import { Occupation } from '../models/Occupation';
import { AirportZone } from '../models/AirportZone';
import { VisitorBadge } from '../models/VisitorBadge';
import { VisitorVehicleBadge } from '../models/VisitorVehicleBadge';


class VisitorsBadges {

}

class VisitorVehicleBadges {
  visitorVehicleBadges: VisitorVehicleBadge[] = [
    {
      id: 'visitor-vehicle-1',
      code: 'visitor-vehicle-1',
      number: 1
    },
    {
      id: 'visitor-vehicle-2',
      code: 'visitor-vehicle-2',
      number: 2
    },
    {
      id: 'visitor-vehicle-3',
      code: 'visitor-vehicle-3',
      number: 3
    }
  ];

  getAllVisitorVehicleBadges() {
    return this.visitorVehicleBadges;
  }

  getVisitorVehicleBadgeById(id: string){
    for(let i = 0; i< this.visitorVehicleBadges.length; i++){
      if(this.visitorVehicleBadges[i].id == id)
        return this.visitorVehicleBadges[i];
    }
    return null;
  }

  addVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge){
    this.visitorVehicleBadges.push(visitorVehicleBadge);
  }

  editVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge, id: string){
    for(let i = 0; i<this.visitorVehicleBadges.length; i++){
      if(this.visitorVehicleBadges[i].id == id){
        this.visitorVehicleBadges[i] = visitorVehicleBadge;
        return this.visitorVehicleBadges[i];
      }
    }
    return null;
  }

  deleteVisitorVehicleBadgeById(id: string){
    for(let i = 0; i<this.visitorVehicleBadges.length; i++){
      if(this.visitorVehicleBadges[i].id == id){
        this.visitorVehicleBadges.splice(i, 1);
      }
    }
    return this.visitorVehicleBadges;
  }


}

class VisitorBadges {
  visitorBadges: VisitorBadge[] = [
    {
      id: 'visitor-badge1',
      code: 'visitor-badge-code1',
      name: 'visitor-badge-name1',
      barcode: 'visitor-badge-barcode1'
    },
    {
      id: 'visitor-badge2',
      code: 'visitor-badge-code2',
      name: 'visitor-badge-name2',
      barcode: 'visitor-badge-barcode2'
    },
    {
      id: 'visitor-badge3',
      code: 'visitor-badge-code3',
      name: 'visitor-badge-name3',
      barcode: 'visitor-badge-barcode3'
    },
  ];

  getAllVisitorBadges() {
    return this.visitorBadges;
  }

  getVisitorBadgeById(id: string){
    for(let i = 0; i< this.visitorBadges.length; i++){
      if(this.visitorBadges[i].id == id)
        return this.visitorBadges[i];
    }
    return null;
  }

  addVisitorBadge(visitorBadge: VisitorBadge){
    this.visitorBadges.push(visitorBadge);
  }

  editVisitorBadge(visitorBadge: VisitorBadge, id: string){
    for(let i = 0; i<this.visitorBadges.length; i++){
      if(this.visitorBadges[i].id == id){
        this.visitorBadges[i] = visitorBadge;
        return this.visitorBadges[i];
      }
    }
    return null;
  }

  deleteVisitorBadgeById(id: string){
    for(let i = 0; i<this.visitorBadges.length; i++){
      if(this.visitorBadges[i].id == id){
        this.visitorBadges.splice(i, 1);
      }
    }
    return this.visitorBadges;
  }
}

class AirportZones {
  airportZones: AirportZone[] = [
    {
      id: 'airport-zone1',
      code: 'airport-zone-code1',
      name: 'zirport-zone-name1'
    },
    {
      id: 'airport-zone2',
      code: 'airport-zone-code2',
      name: 'zirport-zone-name2'
    },
    {
      id: 'airport-zone3',
      code: 'airport-zone-code3',
      name: 'zirport-zone-name3'
    },
  ];

  getAllAirportZones() {
    return this.airportZones;
  }

  getAirportZoneById(id: string){
    for(let i = 0; i< this.airportZones.length; i++){
      if(this.airportZones[i].id == id)
        return this.airportZones[i];
    }
    return null;
  }

  addAirportZone(airportZone: AirportZone){
    this.airportZones.push(airportZone);
  }

  editAirportZone(airportZone: AirportZone, id: string){
    for(let i = 0; i<this.airportZones.length; i++){
      if(this.airportZones[i].id == id){
        this.airportZones[i] = airportZone;
        return this.airportZones[i];
      }
    }
    return null;
  }

  deleteAirportZoneById(id: string){
    for(let i = 0; i<this.airportZones.length; i++){
      if(this.airportZones[i].id == id){
        this.airportZones.splice(i, 1);
      }
    }
    return this.airportZones;
  }
}

class Occupations {
  occupations: Occupation[] = [
    {
      id: 'occupation1',
      code: 'occupation-code1',
      name: 'occupation-name1'
    },
    {
      id: 'occupation2',
      code: 'occupation-code2',
      name: 'occupation-name2'
    },
    {
      id: 'occupation3',
      code: 'occupation-code3',
      name: 'occupation-name3'
    },
  ];

  getAllOccupations() {
    return this.occupations;
  }

  getOccupationById(id: string){
    for(let i = 0; i< this.occupations.length; i++){
      if(this.occupations[i].id == id)
        return this.occupations[i];
    }
    return null;
  }

  addOccupation(occupation: Occupation){
    this.occupations.push(occupation);
  }

  editOccupation(occupation: Occupation, id: string){
    for(let i = 0; i<this.occupations.length; i++){
      if(this.occupations[i].id == id){
        this.occupations[i] = occupation;
        return this.occupations[i];
      }
    }
    return null;
  }

  deleteOccupationById(id: string){
    for(let i = 0; i<this.occupations.length; i++){
      if(this.occupations[i].id == id){
        this.occupations.splice(i, 1);
      }
    }
    return this.occupations;
  }
}

class Gates {
  gates: Gate[] = [
    {
      id: 'gate1',
      code: 'gate-code1',
      name: 'gate-name1'
    },
    {
      id: 'gate2',
      code: 'gate-code2',
      name: 'gate-name2'
    },
    {
      id: 'gate3',
      code: 'gate-code3',
      name: 'gate-name3'
    },
  ]

  getAllGates() {
    return this.gates;
  }

  getGateById(id: string){
    for(let i = 0; i< this.gates.length; i++){
      if(this.gates[i].id == id)
        return this.gates[i];
    }
    return null;
  }

  addGate(gate: Gate){
    this.gates.push(gate);
  }

  editGate(gate: Gate, id: string){
    for(let i = 0; i<this.gates.length; i++){
      if(this.gates[i].id == id){
        this.gates[i] = gate;
        return this.gates[i];
      }
    }
    return null;
  }

  deleteGateById(id: string){
    for(let i = 0; i<this.gates.length; i++){
      if(this.gates[i].id == id){
        this.gates.splice(i, 1);
      }
    }
    return this.gates;
  }
}

class Reasons {
  reasons: Reason[] = [
    {
      id: 'reason1',
      code: 'reason-code1',
      name: 'reason-name1'
    },
    {
      id: 'reason2',
      code: 'reason-code2',
      name: 'reason-name2'
    },
    {
      id: 'reason3',
      code: 'reason-code3',
      name: 'reason-name3'
    },
  ]

  getAllReasons() {
    return this.reasons;
  }

  getReasonById(id: string){
    for(let i = 0; i<this.reasons.length; i++)
      if(this.reasons[i].id == id)
        return this.reasons[i];

    return null;
  }

  addReason(reason: Reason){
    this.reasons.push(reason);
  }

  editReason(reason: Reason, id: string){
    for(let i = 0; i<this.reasons.length; i++){
      if(this.reasons[i].id == id){
        this.reasons[i] = reason;
        return this.reasons[i];
      }
    }
    return null;
  }

  deleteReasonById(id: string){
    for(let i = 0; i<this.reasons.length; i++){
      if(this.reasons[i].id == id){
        this.reasons.splice(i, 1);
      }
    }
    return this.reasons;
  }


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
      company: 'vC1',
      model: 'zastava',
      plate: 'sk-123-qw'
    },
    {
      company: 'vC2',
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
  reasons = new Reasons();
  gates = new Gates();
  occupations = new Occupations();
  airportZones = new AirportZones();
  visitorBadges = new VisitorBadges();
  visitorVehicleBadges = new VisitorVehicleBadges();
  badges: Badge[] = [];
  // zones = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() { }

  setBadges(badges: Badge[]) {
    this.badges = badges;
  }

  getBadges(){
    return this.badges;
  }

}
