import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Badge } from '../models/Badge.model';
import { DatePipe } from '@angular/common';


@Injectable()
export class BadgesService {

  companies = this.resources.companies.getCompaniesNames();
  badges: Badge[] = [];

  constructor(private resources: ResourcesService,
              public datePipe: DatePipe) { }

  getBadges(){
    // console.log("badges: " + this.badges);
    return this.badges;
  }

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
      b.zones = [(i+1)%this.resources.getZones().length,
                  (i+2)%this.resources.getZones().length,
                  (i+3)%this.resources.getZones().length]
      this.badges.push(b);
    }
  }



}
