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
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import 'rxjs/Rx';
import { resourceVehicle } from '../models/resourceVehicle';
import { FormControl } from '@angular/forms';


class hError {
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
}

class VisitorVehicleBadges {
  visitorVehicleBadges: VisitorVehicleBadge[] = [];
  public visitorVehicleBadgesUrl = this.baseUrl + '/api/visitorvehiclebadges';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }
  getAllVisitorVehicleBadges() : Observable<VisitorVehicleBadge[]> {
    return this.http.get<VisitorVehicleBadge[]>(this.visitorVehicleBadgesUrl, { headers: this.headers })
      .pipe(
        retry(3),
      );
  }

  getVisitorVehicleBadgeById(id: number){
    return this.http.get<VisitorVehicleBadge>(this.visitorVehicleBadgesUrl + '/' + id, { headers: this.headers }).
      pipe(
        retry(3),
      );
  }

  addVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge){
    return this.http.post(this.visitorVehicleBadgesUrl, visitorVehicleBadge, { headers: this.headers });
  }

  pushVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge){
    this.visitorVehicleBadges.push(visitorVehicleBadge);
  }

  updateVisitorVehicleBadge(vvb: VisitorVehicleBadge, id: number){
    return this.http.patch(this.visitorVehicleBadgesUrl + '/' + id, vvb, { headers: this.headers });
  }

  deleteVisitorVehicleBadge(id: number) {
    return this.http.delete(this.visitorVehicleBadgesUrl + '/' + id);
  }

  switchVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge, id: number){
    for(let i = 0; i<this.visitorVehicleBadges.length; i++){
      if(this.visitorVehicleBadges[i].id == id){
        this.visitorVehicleBadges[i] = visitorVehicleBadge;
        return this.visitorVehicleBadges[i];
      }
    }
    return null;
  }

  deleteVisitorVehicleBadgeById(id: number){
    this.http.delete(this.visitorVehicleBadgesUrl + '?' + id, { headers: this.headers })
      .subscribe(data => {});
  }

}

@Injectable()
class VisitorBadges {

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }
  visitorBadges: VisitorBadge[] = [];

  public visitorsBadgesUrl = this.baseUrl + '/api/visitorbadges';

  getAllVisitorBadges() : Observable<VisitorBadge[]>{
    return this.http.get<VisitorBadge[]>(this.visitorsBadgesUrl, { headers: this.headers })
      .pipe(
        retry(3),
      );
  }

  getVisitorBadgeById(id: string){
    return this.http.get<VisitorBadge>(this.visitorsBadgesUrl + '/' + id, { headers: this.headers }).
      pipe(
        retry(3),
      );
  }

  addVisitorBadge(visitorBadge: VisitorBadge){
    return this.http.post(this.visitorsBadgesUrl, visitorBadge, { headers: this.headers });
  }

  editVisitorBadge(visitorBadge: VisitorBadge, id: string){
    return this.http.put<VisitorBadge>(this.visitorsBadgesUrl, visitorBadge, { headers: this.headers });
  }

  updateVisitorBadge(vb: VisitorBadge, id: string){
    return this.http.patch(this.visitorsBadgesUrl + '/' + id, vb, { headers: this.headers });
  }

  deleteVisitorBadge(id: number) {
    return this.http.delete(this.visitorsBadgesUrl + '/' + id);
  }

  deleteVisitorBadgeById(id: string) {
    this.http.delete(this.visitorsBadgesUrl + '?' + id, { headers: this.headers })
      .subscribe(data => {});
  }

  switchVisitorBadge(visitorBadge: VisitorBadge, id: string){
   for(let i = 0; i<this.visitorBadges.length; i++){
     if(this.visitorBadges[i].id == id){
       this.visitorBadges[i] = visitorBadge;
       return this.visitorBadges[i];
     }
   }
   return null;
 }

  pushVisitorBadge(vb: VisitorBadge){
    this.visitorBadges.push(vb);
  }

}

class AirportZones {
  airportZones: AirportZone[] = [];

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }
  public airportZonesUrl = this.baseUrl + '/api/zones';

  getAllAirportZones() : Observable<AirportZone[]>{
    return this.http.get<AirportZone[]>(this.airportZonesUrl, { headers: this.headers })
      .pipe(
        retry(3),
      );
  }

  getAirportZoneById(id: string) {
    return this.http.get<AirportZone>(this.airportZonesUrl + '/' + id, { headers: this.headers });
  }

  addAirportZone(airportZone: AirportZone) {
    return this.http.post(this.airportZonesUrl, airportZone, { headers: this.headers });
  }

  pushAirportZone(airportZone : AirportZone) {
    this.airportZones.push(airportZone);
  }

  editAirportZone(airportZone: AirportZone, id: number) {
    return this.http.patch(this.airportZonesUrl + '/' + id, airportZone, { headers: this.headers });
  }

  deleteAirportZone(id: number) {
    return this.http.delete(this.airportZonesUrl + '/' + id);
  }

  switchAirportZone(airportZone: AirportZone, id: number){
    for(let i = 0; i<this.airportZones.length; i++){
      if(this.airportZones[i].id == id){
        this.airportZones[i] = airportZone;
        return this.airportZones[i];
      }
    }
    return null;
  }

  deleteAirportZoneById(id: string){
    this.http.delete(this.airportZonesUrl + '/' + id, { headers: this.headers });
  }
}

class Occupations {
  public occupationsUrl = this.baseUrl + '/api/occupations';

  occupations: Occupation[] = [];

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }
  getAllOccupations() : Observable<Occupation[]> {
    return this.http.get<Occupation[]>(this.occupationsUrl, { headers: this.headers });
  }

  getOccupationById(id: number) {
    return this.http.get<Occupation>(this.occupationsUrl + '/' + id, { headers: this.headers });
  }

  addOccupation(occupation: Occupation){
    return this.http.post(this.occupationsUrl, occupation, { headers: this.headers });
  }

  pushOccupation(occupation: Occupation){
    this.occupations.push(occupation);
  }

  updateOccupation(occupation: Occupation, id: string){
    this.http.put<Occupation>(this.occupationsUrl + '?' + id, occupation, { headers: this.headers })
      .subscribe(data => {});
  }

  deleteOccuparion(id: number) {
    return this.http.delete(this.occupationsUrl + '/' + id);
  }

  switchOccupation(occupation: Occupation, id: string){
    for(let i = 0; i<this.occupations.length; i++){
      if(this.occupations[i].id == id){
        this.occupations[i] = occupation;
        return this.occupations[i];
      }
    }
    return null;
  }

  deleteOccupationById(id: string) {
    this.http.delete(this.occupationsUrl + '?' + id, { headers: this.headers })
      .subscribe(data => {});
  }
}

class Gates {
  gates: Gate[] = [];
  public gatesUrl = this.baseUrl + '/api/gates';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }

  getAllGates() : Observable<Gate[]>{
    return this.http.get<Gate[]>(this.gatesUrl, { headers: this.headers });
  }

  getGateById(id: number){
    return this.http.get<Gate>(this.gatesUrl + '/' + id, { headers: this.headers });
  }

  addGate(gate: Gate){
    return this.http.post<Gate>(this.gatesUrl, gate, { headers: this.headers });
  }

  pushGate(gate: Gate){
    this.gates.push(gate);
  }

  updateGate(gate: Gate, id: number){
    return this.http.patch(this.gatesUrl + '/' + id, gate, { headers: this.headers });
  }

  deleteGate(id: number) {
    return this.http.delete(this.gatesUrl + '/' + id);
  }

  switchGate(gate: Gate, id: number){
    for(let i = 0; i<this.gates.length; i++){
      if(this.gates[i].id == id){
        this.gates[i] = gate;
        return this.gates[i];
      }
    }
    return null;
  }

  deleteGateById(id: number){
    this.http.delete(this.gatesUrl + '?' + id, { headers: this.headers })
      .subscribe(data => {});
  }
}

class Reasons {
  reasons: Reason[] = [];

  public reasonsUrl = this.baseUrl + '/api/reasons';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }
  getAllReasons() : Observable<Reason[]> {
    return this.http.get<Reason[]>(this.reasonsUrl, { headers: this.headers });
  }

  getReasonById(id: string){
    return this.http.get<Reason>(this.reasonsUrl + '/' + id, { headers: this.headers });
  }

  addReason(reason: Reason){
    return this.http.post(this.reasonsUrl, reason, { headers: this.headers });
  }

  pushReason(reason: Reason){
    this.reasons.push(reason);
  }

  updateReason(reason: Reason, id: number){
    return this.http.patch(this.reasonsUrl + '/' + id, reason, { headers: this.headers });
  }

  deleteReason(id: number) {
    return this.http.delete(this.reasonsUrl + '/' + id);
  }

  switchReason(reason: Reason, id: number){
    for(let i = 0; i<this.reasons.length; i++){
      if(this.reasons[i].id == id){
        this.reasons[i] = reason;
        return this.reasons[i];
      }
    }
    return null;
  }

  deleteReasonById(id: string){
    this.http.delete(this.reasonsUrl + '?' + id, { headers: this.headers })
      .subscribe(data => {});
  }
}

class Employees {
  employees: Employee[] = [];
  public employeesUrl = this.baseUrl + '/api/employees';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }

  getAllEmployees() : Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl, { headers: this.headers });
  }

  getEmployeesPage(page = null) : Observable<Employee[]>{
    if(page == null)
      return this.http.get<Employee[]>(this.employeesUrl, { headers: this.headers });

    return this.http.get<Employee[]>(this.employeesUrl + '/page/' + page, { headers: this.headers });
  }

  getEmplyeeById(id: number) {
    return this.http.get<Employee>(this.employeesUrl + '/' + id, { headers: this.headers });
  }

  filterEmployees(filter = null) : Observable<Employee[]>{
    return this.http.get<Employee[]>(this.employeesUrl + '/search/?token=' + filter, {
      headers: this.headers
    });
  }

  filterEntryEmployees(filter = null) : Observable<Employee[]>{
    return this.http.get<Employee[]>(this.employeesUrl + '/entrysearch/?token=' + filter, {
      headers: this.headers
    });
  }

  addEmployee(employee: Employee){
    return this.http.post(this.employeesUrl, employee, { headers: this.headers });
  }

  deleteEmployee(id: number) {
    return this.http.delete(this.employeesUrl + '/' + id);
  }

  pushEmployee(employee: Employee){
    this.employees.push(employee);
  }

  deleteEmployeeById(id: number){
    return this.http.delete(this.employeesUrl + '/' + id, { headers: this.headers });
  }

  updateEmployee(emp: Employee) {
    return this.http.patch(this.employeesUrl + '/' + emp.id, emp, { headers: this.headers });
  }

  switchEmployeeById(emp: Employee){
    for(let i = 0; i<this.employees.length; i++){
      if(this.employees[i].id == emp.id){
        this.employees[i] = emp;
        return 0;
      }
    }
    return null;
  }
}

class Vehicles {
  vehicles: resourceVehicle[] = [];
  public vehiclesUrl = this.baseUrl + '/api/vehicles';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }

  getVehiclesPage(page = null) : Observable<Vehicle[]>{
    if(page == null)
      return this.http.get<Vehicle[]>(this.vehiclesUrl);

    return this.http.get<Vehicle[]>(this.vehiclesUrl + '/page/' + page);
  }

  filterVehicles(filter = null) : Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(this.vehiclesUrl + '/search/?token=' + filter, {
      headers: this.headers
    });
  }

  filterResVehicles(filter = null) : Observable<resourceVehicle[]>{
    return this.http.get<resourceVehicle[]>(this.vehiclesUrl + '/search/?token=' + filter);
  }

  addVehicle(vehicle: resourceVehicle){
    return this.http.post<resourceVehicle>(this.vehiclesUrl, vehicle, { headers: this.headers });
  }

  pushVehicle(vehicle: resourceVehicle){
    this.vehicles.push(vehicle);
  }

  getVehicleByIndex(index: number){
    return this.http.get<resourceVehicle>(this.vehiclesUrl + '/' + index, { headers: this.headers });
  }

  deleteVehicle(id: number) {
    return this.http.delete(this.vehiclesUrl + '/' + id);
  }

  getAllVehicles(){
    return this.http.get<resourceVehicle[]>(this.vehiclesUrl, { headers: this.headers });
  }

  editVehicle(v: resourceVehicle){
    return this.http.patch<resourceVehicle>(this.vehiclesUrl + '/' + v.id, v, { headers: this.headers });
  }


  switchVehicleById(v: resourceVehicle){
    for(let i = 0; i<this.vehicles.length; i++){
      if(this.vehicles[i].id == v.id){
        this.vehicles[i] = v;
        return 0;
      }
    }
    return null;
  }

  removeVehicle(index: number) {
    this.vehicles.splice(index, 1);
  }

  setVehicles(vehicles: resourceVehicle[]){
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

  companies: Company[] = [];

  public companiesUrl = this.baseUrl + '/api/companies';

  headers = null;
  constructor(private http: HttpClient, private ho, private baseUrl) {
    this.headers = ho;
  }

  getCompanies() : Observable<Company[]>{
    return this.http.get<Company[]>(this.companiesUrl, { headers: this.headers });
  }

  filterCompanies(filter = null) : Observable<Company[]>{
    return this.http.get<Company[]>(this.companiesUrl + '/search/?token=' + filter);
  }

  getCompaniesPage(page = null) : Observable<Company[]>{
    if(page == null)
      return this.http.get<Company[]>(this.companiesUrl);

    return this.http.get<Company[]>(this.companiesUrl + '/page/' + page);
  }

  deleteCompany(id: number) {
    return this.http.delete(this.companiesUrl + '/' + id);
  }

  getCompaniesNames() {
    let compNames = [];
    for(let i = 0; i<this.companies.length; i++)
      compNames.push(this.companies[i].name);

    return compNames;
  }

  getCompanyById(id: number) {
    return this.http.get<Company>(this.companiesUrl + '/' + id, { headers: this.headers });
  }

  addCompany(company: Company) {
    return this.http.post<Company>(this.companiesUrl, company, { headers: this.headers });
  }

  pushCompany(company: Company) {
    this.companies.push(company);
  }

  editCompany(c : Company){
    return this.http.patch<Company>(this.companiesUrl + '/' + c.id, c, { headers: this.headers });
  }

  switchCompany(c: Company){
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].id == c.id){
        this.companies[i] = c;
      }
    return null;
  }

  getCompanyByName(name: string){
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].name == name)
        return this.companies[i];
    return null;
  }

  deleteCompanyById(id : number) {
    return this.http.delete(this.companiesUrl + '/' + id, { headers: this.headers });
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
  constructor(private http : HttpClient,
              private auth: AuthService) {  }
  bUrl = this.auth.baseUrl;
  headers: HttpHeaders = this.auth.getHeaders();
  companies = new Companies(this.http, this.headers, this.bUrl);
  vehicles = new Vehicles(this.http, this.headers, this.bUrl);
  employees = new Employees(this.http, this.headers, this.bUrl);
  reasons = new Reasons(this.http, this.headers, this.bUrl);
  gates = new Gates(this.http, this.headers, this.bUrl);
  occupations = new Occupations(this.http, this.headers, this.bUrl);
  airportZones = new AirportZones(this.http, this.headers, this.bUrl);
  visitorBadges = new VisitorBadges(this.http, this.headers, this.bUrl);
  visitorVehicleBadges = new VisitorVehicleBadges(this.http, this.headers, this.bUrl);
  badges: Badge[] = [];

  setBadges(badges: Badge[]) {
    this.badges = badges;
  }

  getBadges(){
    return this.badges;
  }

}
