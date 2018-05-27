import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Badge } from '../models/Badge.model';
import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { retry } from 'rxjs/operator/retry';


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

  getBadges(page = null) : Observable<Badge[]>{
    if(page == null)
      return this.http.get<Badge[]>(this.badgesUrl, this.httpOptions);

    return this.http.get<Badge[]>(this.badgesUrl + '/page/' + page, this.httpOptions);
  }

  getBadgeById(id: number) : Observable<Badge>{
    console.log('vo getBadgeById');
    return this.http.get<Badge>(this.badgesUrl + '/' + id, this.httpOptions);
  }

  addBadge(badge: Badge){
    console.log('vo addBadge()');
    return this.http.post(this.badgesUrl, badge, this.httpOptions);
  }

  pushBadge(badge: Badge){
    this.badges.push(badge);
  }

  updateBadge(b: Badge, id: number){
    return this.http.patch(this.badgesUrl + '/' + id, b, this.httpOptions);
  }

  switchBadge(badge: Badge, id: number){
    for(let i = 0; i<this.badges.length; i++){
      if(this.badges[i].id == id){
        this.badges[i] = badge;
        return this.badges[i];
      }
    }
    return null;
  }

  // getBadges(){
  //   // console.log("badges: " + this.badges);
  //   return this.badges;
  // }

  // getBadgesPage(from: number, to: number) {
  //   return this.badges.slice(from, to);
  // }

  // seedBadges(n: number = 10) {
  //   // console.log("vo seedBadges");
  //   for(let i = 0; i<n; i++) {
  //     let b = new Badge();
  //     b.id = i;
  //     b.company = this.companies[i % this.companies.length];
  //     b.personName = 'name' + i.toString();
  //     b.dateSecCheck = Date.now()
  //     b.dateTraining = Date.now();
  //     b.validTo = Date.now();
  //     // b.zones = [(i+1)%this.resources.airportZones.getAllAirportZones().length,
  //     //             (i+2)%this.resources.airportZones.getAllAirportZones().length,
  //     //             (i+3)%this.resources.airportZones.getAllAirportZones().length]
  //     this.badges.push(b);
  //   }
  // }



}
