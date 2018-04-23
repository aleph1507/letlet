import { Injectable } from '@angular/core';
import { Badge } from '../models/Badge.model';

@Injectable()
export class ResourcesService {
  companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  badges: Badge[] = [];
  zones = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() { }

  getCompanies() {
    return this.companies;
  }

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
