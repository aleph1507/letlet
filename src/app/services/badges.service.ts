import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Badge } from '../models/Badge.model';
import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class BadgesService {

  companies = this.resources.companies.getCompaniesNames();
  badges: Badge[] = [];

  public badgesUrl = 'http://192.168.100.4:84/api/badges';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + 'OVdSQO8unD8O7jCsDBBqNnmbiLHbtR5h7jg_iA3SP8Wxc7TPFkcxXgy7TO5WZX9vBdD_GxDM0jtFMpzSTlx8Ooe5jNhbyflfYCZPfswkLY4POCso_ysWeUg_98y_8sWQvFVnkbmNRWKRqHCmLzOhGRrVjduJ8ORgTk3eScYc_R2fpiGHE1KBvfzPnuSOhvgpIFy-1B-FlxmZwbNz3wloSHHtklUdRkfelAZSKBGBJ5MH3dxgnbsau22Qm8muhXCE09FplfiqFq5B7KNMjEDd6vh-T0MQG8aDoARGVqA-VHwFShUvFKmY_4sjvmaCNYRAfbQf4c_wPdkmR6vqhYePAUK3oDI-50dQfgdGkBNcQN8aamujiKouRhnNSNRuXZ81s_MAdcBqyIrwJdc7khG6tg',
      'Accept': 'application/json'
    })
  }

  constructor(private resources: ResourcesService,
              public datePipe: DatePipe,
              private http: HttpClient) { }

  getBadges() : Observable<Badge[]>{
    return this.http.get<Badge[]>(this.badgesUrl, this.httpOptions);
  }

  // getBadges(){
  //   // console.log("badges: " + this.badges);
  //   return this.badges;
  // }

  getBadgesPage(from: number, to: number) {
    return this.badges.slice(from, to);
  }

  seedBadges(n: number = 10) {
    // console.log("vo seedBadges");
    for(let i = 0; i<n; i++) {
      let b = new Badge();
      b.id = i;
      b.company = this.companies[i % this.companies.length];
      b.personName = 'name' + i.toString();
      b.dateSecCheck = Date.now()
      b.dateTraining = Date.now();
      b.validTo = Date.now();
      // b.zones = [(i+1)%this.resources.airportZones.getAllAirportZones().length,
      //             (i+2)%this.resources.airportZones.getAllAirportZones().length,
      //             (i+3)%this.resources.airportZones.getAllAirportZones().length]
      this.badges.push(b);
    }
  }



}
