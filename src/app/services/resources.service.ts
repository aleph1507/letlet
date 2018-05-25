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

// class VisitorsBadges {
//
// }

class hError {
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
}

class VisitorVehicleBadges {
  visitorVehicleBadges: VisitorVehicleBadge[] = [];
  public visitorVehicleBadgesUrl = 'http://192.168.100.4:84/api/visitorvehiclebadges';
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  getAllVisitorVehicleBadges() {
    console.log('getAllVisitorVehicleBadges()');
    console.log('this.http : ' + this.http);
    return this.http.get<VisitorVehicleBadge[]>(this.visitorVehicleBadgesUrl, this.httpOptions)
      .pipe(
        retry(3),
      );
  }

  getVisitorVehicleBadgeById(id: number){
    console.log('vo getVisitorVehicleBadgeById');
    return this.http.get<VisitorBadge>(this.visitorVehicleBadgesUrl + '/' + id, this.httpOptions).
      pipe(
        retry(3),
      );
  }

  // getVisitorVehicleBadgeById(id: number){
  //   for(let i = 0; i< this.visitorVehicleBadges.length; i++){
  //     if(this.visitorVehicleBadges[i].id == id)
  //       return this.visitorVehicleBadges[i];
  //   }
  //   return null;
  // }

  addVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge){
    console.log('vo addVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge)');
    return this.http.post(this.visitorVehicleBadgesUrl, visitorVehicleBadge, this.httpOptions);
  }

  pushVisitorVehicleBadge(visitorVehicleBadge: VisitorVehicleBadge){
    this.visitorVehicleBadges.push(visitorVehicleBadge);
  }

  updateVisitorVehicleBadge(vvb: VisitorVehicleBadge, id: number){
    return this.http.patch(this.visitorVehicleBadgesUrl + '/' + id, vvb, this.httpOptions);
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
    this.http.delete(this.visitorVehicleBadgesUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
  }

}

@Injectable()
class VisitorBadges {

  // public http: HttpClient;

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  visitorBadges: VisitorBadge[] = [];

  public visitorsBadgesUrl = 'http://192.168.100.4:84/api/visitorbadges';
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  getAllVisitorBadges() {
    // var he = new hError();
    console.log('getAllVisitorBadges()');
    console.log('this.http : ' + this.http);
    // this.http.get(this.visitorsBadgesUrl, this.httpOptions).subscribe(
    //   (data) => {console.log(data)}
    // );
    return this.http.get<VisitorBadge[]>(this.visitorsBadgesUrl, this.httpOptions)
      .pipe(
        retry(3),
      );
  }

  // getAllVisitorBadges() {
  //   return this.visitorBadges;
  // }

  getVisitorBadgeById(id: string){
    console.log('vo getVisitorBadgeById');
    return this.http.get<VisitorBadge>(this.visitorsBadgesUrl + '/' + id, this.httpOptions).
      pipe(
        retry(3),
      );
  }

  // getVisitorBadgeById(id: string){
  //   for(let i = 0; i< this.visitorBadges.length; i++){
  //     if(this.visitorBadges[i].id == id)
  //       return this.visitorBadges[i];
  //   }
  //   return null;
  // }

  addVisitorBadge(visitorBadge: VisitorBadge){
    return this.http.post(this.visitorsBadgesUrl, visitorBadge, this.httpOptions);
  }

  // addVisitorBadge(visitorBadge: VisitorBadge){
  //   this.visitorBadges.push(visitorBadge);
  // }

  editVisitorBadge(visitorBadge: VisitorBadge, id: string){
    return this.http.put<VisitorBadge>(this.visitorsBadgesUrl, visitorBadge, this.httpOptions);
  }

  updateVisitorBadge(vb: VisitorBadge, id: string){
    return this.http.patch(this.visitorsBadgesUrl + '/' + id, vb, this.httpOptions);
  }

  // editVisitorBadge(visitorBadge: VisitorBadge, id: string){
  //   for(let i = 0; i<this.visitorBadges.length; i++){
  //     if(this.visitorBadges[i].id == id){
  //       this.visitorBadges[i] = visitorBadge;
  //       return this.visitorBadges[i];
  //     }
  //   }
  //   return null;
  // }

  deleteVisitorBadgeById(id: string) {

    // return this.http.delete(this.visitorsBadgesUrl + '?' + id, httpOptions);
    this.http.delete(this.visitorsBadgesUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  // deleteVisitorBadgeById(id: string){
  //   for(let i = 0; i<this.visitorBadges.length; i++){
  //     if(this.visitorBadges[i].id == id){
  //       this.visitorBadges.splice(i, 1);
  //     }
  //   }
  //   return this.visitorBadges;
  // }

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
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }
  airportZones: AirportZone[] = [];

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  public airportZonesUrl = 'http://192.168.100.4:84/api/zones';

  getAllAirportZones() {
    console.log('getAllAirportZones()');
    return this.http.get<AirportZone[]>(this.airportZonesUrl, this.httpOptions)
      .pipe(
        retry(3),
      );
  }

  // getAllAirportZones() {
  //   return this.airportZones;
  // }

  getAirportZoneById(id: string) {
    return this.http.get<AirportZone>(this.airportZonesUrl + '/' + id, this.httpOptions);
  }

  // getAirportZoneById(id: string){
  //   for(let i = 0; i< this.airportZones.length; i++){
  //     if(this.airportZones[i].id == id)
  //       return this.airportZones[i];
  //   }
  //   return null;
  // }

  addAirportZone(airportZone: AirportZone) {
    return this.http.post(this.airportZonesUrl, airportZone, this.httpOptions);
  }

  // addAirportZone(airportZone: AirportZone){
  //   this.airportZones.push(airportZone);
  // }

  pushAirportZone(airportZone : AirportZone) {
    this.airportZones.push(airportZone);
  }

  editAirportZone(airportZone: AirportZone, id: number) {
    return this.http.patch(this.airportZonesUrl + '/' + id, airportZone, this.httpOptions);
  }

  // updateAirportZone(airportZone: AirportZone, id: string){
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //       'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
  //       'Accept': 'application/json'
  //     })
  //   }
  //   this.http.put(this.airportZonesUrl, airportZone, httpOptions)
  //     .subscribe(
  //       data => console.log(data)
  //     )
  // }

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
    this.http.delete(this.airportZonesUrl + '/' + id, this.httpOptions);
  }

  // deleteAirportZoneById(id: string){
  //   for(let i = 0; i<this.airportZones.length; i++){
  //     if(this.airportZones[i].id == id){
  //       this.airportZones.splice(i, 1);
  //     }
  //   }
  //   return this.airportZones;
  // }
}

class Occupations {
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  public occupationsUrl = 'http://192.168.100.4:84/api/occupations';
  occupations: Occupation[] = [];

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  getAllOccupations() {
    return this.http.get<Occupation[]>(this.occupationsUrl, this.httpOptions);
  }

  // getAllOccupations() {
  //   return this.occupations;
  // }

  getOccupationById(id: number) {
    return this.http.get<Occupation>(this.occupationsUrl + '/' + id, this.httpOptions);
  }

  // getOccupationById(id: string){
  //   for(let i = 0; i< this.occupations.length; i++){
  //     if(this.occupations[i].id == id)
  //       return this.occupations[i];
  //   }
  //   return null;
  // }

  addOccupation(occupation: Occupation){
    return this.http.post(this.occupationsUrl, occupation, this.httpOptions);
  }

  pushOccupation(occupation: Occupation){
    this.occupations.push(occupation);
  }

  editOccupation() {
    console.log('editOccupation empty');
  }

  updateOccupation(occupation: Occupation, id: string){
    this.http.put<Occupation>(this.occupationsUrl + '?' + id, occupation, this.httpOptions)
      .subscribe(data => console.log(data));
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
    this.http.delete(this.occupationsUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  // deleteOccupationById(id: string){
  //   for(let i = 0; i<this.occupations.length; i++){
  //     if(this.occupations[i].id == id){
  //       this.occupations.splice(i, 1);
  //     }
  //   }
  //   return this.occupations;
  // }
}

class Gates {
  gates: Gate[] = [];
  public gatesUrl = 'http://192.168.100.4:84/api/gates';
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }
  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  getAllGates() {
    console.log('vo getAllGates()');
    return this.http.get<Gate[]>(this.gatesUrl, this.httpOptions);
  }

  // getAllGates() {
  //   return this.gates;
  // }

  getGateById(id: number){
    console.log('vo getGateById');
    return this.http.get<Gate>(this.gatesUrl + '/' + id, this.httpOptions);
  }

  // getGateById(id: string){
  //   for(let i = 0; i< this.gates.length; i++){
  //     if(this.gates[i].id == id)
  //       return this.gates[i];
  //   }
  //   return null;
  // }

  addGate(gate: Gate){
    console.log('vo addGate() this.httpOptions.headers : ' + this.httpOptions.headers.get('Authorization'));
    return this.http.post<Gate>(this.gatesUrl, gate, this.httpOptions);
  }

  pushGate(gate: Gate){
    this.gates.push(gate);
  }

  updateGate(gate: Gate, id: number){
    return this.http.patch(this.gatesUrl + '/' + id, gate, this.httpOptions);
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
    this.http.delete(this.gatesUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  // deleteGateById(id: string){
  //   for(let i = 0; i<this.gates.length; i++){
  //     if(this.gates[i].id == id){
  //       this.gates.splice(i, 1);
  //     }
  //   }
  //   return this.gates;
  // }
}

class Reasons {
  reasons: Reason[] = [];

  public reasonsUrl = 'http://192.168.100.4:84/api/reasons';
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }
  getAllReasons() {
    console.log('vo getAllReasons()');
    return this.http.get<Reason[]>(this.reasonsUrl, this.httpOptions);
  }

  // getAllReasons() {
  //   return this.reasons;
  // }

  getReasonById(id: string){
    console.log('vo getReasonById()');
    return this.http.get<Reason>(this.reasonsUrl + '/' + id, this.httpOptions);
  }

  // getReasonById(id: string){
  //   for(let i = 0; i<this.reasons.length; i++)
  //     if(this.reasons[i].id == id)
  //       return this.reasons[i];
  //
  //   return null;
  // }

  addReason(reason: Reason){
    console.log('vo AddReason()');
    return this.http.post(this.reasonsUrl, reason, this.httpOptions);
  }

  pushReason(reason: Reason){
    this.reasons.push(reason);
  }

  updateReason(reason: Reason, id: number){
    console.log('vo updateReason');
    return this.http.patch(this.reasonsUrl + '/' + id, reason, this.httpOptions);
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
    this.http.delete(this.reasonsUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  // deleteReasonById(id: string){
  //   for(let i = 0; i<this.reasons.length; i++){
  //     if(this.reasons[i].id == id){
  //       this.reasons.splice(i, 1);
  //     }
  //   }
  //   return this.reasons;
  // }
}

class Employees {
  employees: Employee[] = [];
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  public employeesUrl = 'http://192.168.100.4:84/api/employees';

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }

  getAllEmployees() {
    console.log('vo getAllEmployees');
    return this.http.get<Employee[]>(this.employeesUrl, this.httpOptions);
  }

  // getAllEmployees() {
  //   return this.employees;
  // }

  getEmplyeeById(id: number) {
    console.log('vo getEmployeeById');
    return this.http.get<Employee>(this.employeesUrl + '/' + id, this.httpOptions);
  }

  // getEmplyeeById(id: number){
  //   for(let i = 0; i<this.employees.length; i++)
  //     if(this.employees[i].id == id)
  //       return this.employees[i];
  //   return null;
  // }

  addEmployee(employee: Employee){
    return this.http.post(this.employeesUrl, employee, this.httpOptions);
  }

  pushEmployee(employee: Employee){
    this.employees.push(employee);
  }

  deleteEmployeeById(id: number){
    return this.http.delete(this.employeesUrl + '/' + id, this.httpOptions);
  }

  // deleteEmployeeById(id: number){
  //   for(let i = 0; i<this.employees.length; i++)
  //     if(this.employees[i].id == id){
  //       this.employees.splice(i, 1);
  //       return 0;
  //     }
  //   return null;
  // }

  updateEmployee(emp: Employee) {
    return this.http.patch(this.employeesUrl + '/' + emp.id, emp, this.httpOptions);
  }

  switchEmployeeById(emp: Employee){
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
  vehicles: Vehicle[] = [];
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  public vehiclesUrl = 'http://192.168.100.4:84/api/vehicles';

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
    console.log('hoe: ' + ho.headers.get('Authorization'));
  }

  addVehicle(vehicle: Vehicle){
    return this.http.post<Vehicle>(this.vehiclesUrl, vehicle, this.httpOptions);
  }

  pushVehicle(vehicle: Vehicle){
    this.vehicles.push(vehicle);
  }

  getVehicleByIndex(index: number){
    return this.http.get<Vehicle>(this.vehiclesUrl, this.httpOptions);
  }

  // getVehicleByIndex(index: number) {
  //   return this.vehicles[index];
  // }

  getAllVehicles(){
    return this.http.get<Vehicle[]>(this.vehiclesUrl, this.httpOptions);
  }

  // getAllVehicles(){
  //   return this.vehicles;
  // }

  editVehicle(v: Vehicle){
    return this.http.patch<Vehicle>(this.vehiclesUrl + '/' + v.id, v, this.httpOptions);
  }


  switchVehicleById(v: Vehicle){
    console.log('editVehicleByID vehicle: ', v);
    for(let i = 0; i<this.vehicles.length; i++){
      if(this.vehicles[i].id == v.id){
        this.vehicles[i] = v;
        // console.log('employee edited: ', this.employees[i]);
        return 0;
      }
    }
    return null;
  }


  // editVehicle(index: number, vehicle: Vehicle) {
  //   this.vehicles[index] = vehicle;
  //   return this.vehicles[index];
  // }

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
  // companies: Company[] = [
  //   {
  //     id: 1,
  //     name: 'AMC'
  //   },
  //   {
  //     id: 2,
  //     name: 'BBC'
  //   },
  //   {
  //     id: 3,
  //     name: 'TAV'
  //   },
  //   {
  //     id: 4,
  //     name: 'DrinkerLab'
  //   }
  // ];
  companies: Company[] = [];
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer vLAF8elQ5r7gunytO65szem5dlajGWqLAmkaNtgfhVeQKi8fmlV-mzbYfa9fFBnJYWGa67b0fIzMuYUZdt2s3Sx7zdCvudAKXCHc1RgDikcNecmiHSIs_eu9eDnhYe7KIv1CWellcVQjatUEj1wFJtfIbds1-sgzeXXjQSLwT5gv-v9bOMsX0Kj-xehPvokv8VUYOYbz2luszzUuzQZ1Z7tS_YrAkTa2Ve_2HjcR6SClvjxbzYAGa6_P-Ea5BZvZwfNX8Q47NJhru9W0WDqOBHDH4_ch2b9AIePWArcx6krMyGJSfPN06c-46BvHDxevTkc4AbagtSFDZKMtWV8YFHenwNmof1aOKNv46PWacuptgfQFGv-CS7ot8Z4dYHVHoOidGz2mw0g0Y9ywuzimag',
  //     'Accept': 'application/json'
  //   })
  // }

  public companiesUrl = 'http://192.168.100.4:84/api/companies';

  httpOptions = null;
  constructor(private http: HttpClient, private ho) {
    this.httpOptions = ho;
  }

  getCompanies() {
    return this.http.get<Company[]>(this.companiesUrl, this.httpOptions);
  }

  // getCompanies() {
  //   return this.companies;
  // }

  getCompaniesNames() {
    let compNames = [];
    for(let i = 0; i<this.companies.length; i++)
      compNames.push(this.companies[i].name);

    return compNames;
  }

  // getCompanyById(id: number) {
  //   for(let i = 0; i<this.companies.length; i++)
  //     if(this.companies[i].id == id)
  //       return this.companies[i];
  //   return null;
  // }

  getCompanyById(id: number) {
    return this.http.get<Company>(this.companiesUrl + '/' + id, this.httpOptions);
  }

  addCompany(company: Company) {
    return this.http.post<Company>(this.companiesUrl, company, this.httpOptions);
  }

  pushCompany(company: Company) {
    this.companies.push(company);
    // console.log('add company: ', company);
    // console.log('companies: ', this.companies);
  }

  editCompany(c : Company){
    return this.http.patch<Company>(this.companiesUrl + '/' + c.id, c, this.httpOptions);
  }

  switchCompany(c: Company){
    // this.companies[index].name = name;
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].id == c.id){
        // console.log('name: ', name);
        // console.log('edit company: ', this.companies[i]);
        this.companies[i] = c;
        // console.log('companies postedit: ', this.companies);
        // return this.companies[i];
      }
    return null;
  }

  // getCompanyByIndex(index: number){
  //   return this.companies[index];
  // }

  getCompanyByName(name: string){
    for(let i = 0; i<this.companies.length; i++)
      if(this.companies[i].name == name)
        return this.companies[i];
    return null;
  }

  deleteCompanyById(id : number) {
    return this.http.delete(this.companiesUrl + '/' + id, this.httpOptions);
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
  // companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer ' + this.auth.getToken(),
  //     'Accept': 'application/json'
  //   })
  // }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + 'FCTyLtiYAdyYf1gQ9OdwXWw9__dQgwCkov0zhTJHDHIOxWf1dkH-1_KlvCBAYbF0rOdmD3fYM7H5ZmP2Ri7SLDtAmFeN6rHakdiaEpb0tBEu22HGOFcckatmvWD5pTDYDCbVi5VAmJ88psa6d10gCkJYDY6HHJu-yb7-LPCl9lOXyTmDIw509Shcb1FdLZy-Tz0YCvChXWdeECRNMFc1B1AqnYrdVqxaHWScbYq4-7krCWyrvtvDtavroqMV9-jlp8jQHnie4RnwklJIVGm6QPesDWb1uevNenMEUdanBGiCw6cztXYUe4mXGL7aKI71pOib75Nwn0PjbXw9Uz-enBHSGpFxNExlN4v9o_zCtiMbU2kCgouNQzRTvQuloivPKRXGVri7OVkdHu7ZOfLehA',
      'Accept': 'application/json'
    })
  }
  companies = new Companies(this.http, this.httpOptions);
  vehicles = new Vehicles(this.http, this.httpOptions);
  employees = new Employees(this.http, this.httpOptions);
  reasons = new Reasons(this.http, this.httpOptions);
  gates = new Gates(this.http, this.httpOptions);
  occupations = new Occupations(this.http, this.httpOptions);
  airportZones = new AirportZones(this.http, this.httpOptions);
  visitorBadges = new VisitorBadges(this.http, this.httpOptions);
  visitorVehicleBadges = new VisitorVehicleBadges(this.http, this.httpOptions);
  badges: Badge[] = [];

  // zones = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  setBadges(badges: Badge[]) {
    this.badges = badges;
  }

  getBadges(){
    return this.badges;
  }

}
