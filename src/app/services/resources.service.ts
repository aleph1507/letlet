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

@Injectable()
class VisitorBadges {

  // public http: HttpClient;

  constructor(private http: HttpClient) {}

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

  public visitorsBadgesUrl = 'http://192.168.100.4:84/api/visitorbadges';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer OISzBvzSAdxa8W9gFkgVnNzPW4v3IpN32yI7bo-folhKUUu7cRoRDCHSfKZcIzMX9lpqwiCelLWPp4JmuYx_6F4mveUg-h8lL-fqGspf-jFVXrmCX0RGkuDy4LpLW9EaYzcP5Fa2SgGX8r33VSFEIdyAGP58WReoiOMmd0dvOfMeYTvy2pvfFA5tP7_P5aCVDm0mvi1TcDSEsilBvkWnkIYIaKtvvbqygJJ3QvSlsBjBVTu5KynF4fhRu8XAIvu4AGU08yVnZLBfr1sIogGszzILMZgInw-LIIhYr8uwGSxPgN2oByDpMPpF4sAnPFH-D8vLKY7xrFJSWkypDY1KDvnJevekTAiisiWm3vtPuQKC3pFB1h81l-mnpxMHV4PjztAlnk7K4_G0rwOSzQDcJQ',
      'Accept': 'application/json'
    })
  }

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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
        'Accept': 'application/json'
      })
    }
    // return this.http.delete(this.visitorsBadgesUrl + '?' + id, httpOptions);
    this.http.delete(this.visitorsBadgesUrl + '?' + id, httpOptions)
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

  constructor(private http: HttpClient) {}

  public airportZonesUrl = 'http://192.168.100.4:84/api/airportzones';

  getAllAirportZones() {
    console.log('getAllAirportZones()');
    this.http.get<AirportZone[]>(this.airportZonesUrl).subscribe(
      data => console.log(data)
    );
  }

  // getAllAirportZones() {
  //   return this.airportZones;
  // }

  getAirportZoneById(id: string) {
    this.http.get<AirportZone>(this.airportZonesUrl + '?' + id).subscribe(
      data => console.log(data)
    );
  }

  // getAirportZoneById(id: string){
  //   for(let i = 0; i< this.airportZones.length; i++){
  //     if(this.airportZones[i].id == id)
  //       return this.airportZones[i];
  //   }
  //   return null;
  // }

  addAirportZone(airportZone: AirportZone) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
        'Accept': 'application/json'
      })
    }
    this.http.post(this.airportZonesUrl, airportZone, httpOptions)
      .subscribe(data => console.log(data));
  }

  // addAirportZone(airportZone: AirportZone){
  //   this.airportZones.push(airportZone);
  // }

  pushAirportZone(airportZone : AirportZone) {
    this.airportZones.push(airportZone);
  }

  editAirportZone() {
    console.log('editAirportZone() empty');
  }

  updateAirportZone(airportZone: AirportZone, id: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
        'Accept': 'application/json'
      })
    }
    this.http.put(this.airportZonesUrl, airportZone, httpOptions)
      .subscribe(
        data => console.log(data)
      )
  }

  switchAirportZone(airportZone: AirportZone, id: string){
    for(let i = 0; i<this.airportZones.length; i++){
      if(this.airportZones[i].id == id){
        this.airportZones[i] = airportZone;
        return this.airportZones[i];
      }
    }
    return null;
  }

  deleteAirportZoneById(id: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
        'Accept': 'application/json'
      })
    }
    this.http.delete(this.airportZonesUrl + '?' + id, httpOptions)
      .subscribe(data => console.log(data))
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

  public occupationsUrl = 'http://192.168.100.4:84/api/occupations';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
      'Accept': 'application/json'
    })
  }

  constructor(private http : HttpClient) {}

  getAllOccupations() {
    this.http.get<Occupation[]>(this.occupationsUrl)
      .subscribe(data => console.log(data));
  }

  // getAllOccupations() {
  //   return this.occupations;
  // }

  getOccupationById(id: string) {
    this.http.get<Occupation>(this.occupationsUrl + '?' + id)
      .subscribe(data => console.log(data));
  }

  // getOccupationById(id: string){
  //   for(let i = 0; i< this.occupations.length; i++){
  //     if(this.occupations[i].id == id)
  //       return this.occupations[i];
  //   }
  //   return null;
  // }

  addOccupation(occupation: Occupation){
    this.http.post(this.occupationsUrl, occupation, this.httpOptions)
      .subscribe(data => console.log(data));
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

  public gatesUrl = 'http://192.168.100.4:84/api/gates';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
      'Accept': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllGates() {
    this.http.get<Gate[]>(this.gatesUrl)
      .subscribe(data => console.log(data));
  }

  // getAllGates() {
  //   return this.gates;
  // }

  getGateById(id: string){
    this.http.get<Gate>(this.gatesUrl + '?' + id)
      .subscribe(data => console.log(data));
  }

  // getGateById(id: string){
  //   for(let i = 0; i< this.gates.length; i++){
  //     if(this.gates[i].id == id)
  //       return this.gates[i];
  //   }
  //   return null;
  // }

  addGate(gate: Gate){
    this.http.post<Gate>(this.gatesUrl, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  pushGate(gate: Gate){
    this.gates.push(gate);
  }

  updateGate(gate: Gate, id: string){
    this.http.put(this.gatesUrl + '?' + id, gate, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  switchGate(gate: Gate, id: string){
    for(let i = 0; i<this.gates.length; i++){
      if(this.gates[i].id == id){
        this.gates[i] = gate;
        return this.gates[i];
      }
    }
    return null;
  }

  deleteGateById(id: string){
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

  public reasonsUrl = 'http://192.168.100.4:84/api/reasons';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
      'Accept': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllReasons() {
    console.log('vo getAllReasons()');
    this.http.get<Reason[]>(this.reasonsUrl)
      .subscribe(data => console.log(data));
  }

  // getAllReasons() {
  //   return this.reasons;
  // }

  getReasonById(id: string){
    console.log('vo getReasonById()');
    this.http.get<Reason>(this.reasonsUrl + '?' + id)
      .subscribe(data => console.log(data));
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
    this.http.post(this.reasonsUrl, reason, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  pushReason(reason: Reason){
    this.reasons.push(reason);
  }

  updateReason(reason: Reason, id: string){
    console.log('vo updateReason');
    this.http.put(this.reasonsUrl + '?' + id, reason, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  switchReason(reason: Reason, id: string){
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

  public employeesUrl = 'http://192.168.100.4:84/api/employees';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'TpASVw-gFSBtV8mXlNXVGinX-UHiHZn3uiGQlvj6VYNRH4lTVotSR6yT8bAOTr_9Hcy1TNGRsSRjF-r1KHjBcaBcVGuY2CmpZn0u6lrNcqhGP9Zhd5ecY21g5fJWzlbaBUMi-llphw_syOK2tEy2jF1v2Ff7aqCWVyMKJiriWqwiY2-hCQjNXC5VCQd9zlbSDlWehjFbDM0iBkLf17z5CKnMN1kccUGWrxJl_LrhdZybkiYD3n7rWUvnOzslstqx-XVDw2drwWx3ztNl5TMng9f4QKqiGDdcv-DQW2rClA6DYrIwpa5kdnEeqFTcH6G2RLnE3e_5yUZifefq9MDdaiPR5KFt6knOALAL30thoSPXS4kv_mhNfQnIn7Y7Dom3ngSPkKuZTyVEwCJ3e9N6Ig',
      'Accept': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllEmployees() {
    console.log('vo getAllEmployees');
    this.http.get<Employee[]>(this.employeesUrl)
      .subscribe(data => console.log(data));
  }

  // getAllEmployees() {
  //   return this.employees;
  // }

  getEmplyeeById(id: number) {
    console.log('vo getEmployeeById');
    this.http.get<Employee>(this.employeesUrl + '?' + id)
      .subscribe(data => console.log(data));
  }

  // getEmplyeeById(id: number){
  //   for(let i = 0; i<this.employees.length; i++)
  //     if(this.employees[i].id == id)
  //       return this.employees[i];
  //   return null;
  // }

  addEmployee(employee: Employee){
    this.http.post(this.employeesUrl, employee, this.httpOptions)
      .subscribe(data => console.log(data));
  }

  pushEmployee(employee: Employee){
    this.employees.push(employee);
  }

  deleteEmployeeById(id: number){
    this.http.delete(this.employeesUrl + '?' + id, this.httpOptions)
      .subscribe(data => console.log(data));
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
    this.http.put(this.employeesUrl, emp, this.httpOptions)
      .subscribe(data => console.log(data));
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
  employees = new Employees(this.http);
  reasons = new Reasons(this.http);
  gates = new Gates(this.http);
  occupations = new Occupations(this.http);
  airportZones = new AirportZones(this.http);
  visitorBadges = new VisitorBadges(this.http);
  visitorVehicleBadges = new VisitorVehicleBadges();
  badges: Badge[] = [];
  // zones = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private http : HttpClient) { }

  setBadges(badges: Badge[]) {
    this.badges = badges;
  }

  getBadges(){
    return this.badges;
  }

}