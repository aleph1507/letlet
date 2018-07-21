import { Injectable } from '@angular/core';
import { VehicleBadge } from '../models/VehicleBadge';
import { AuthService } from './auth.service';
import { ResourcesService } from './resources.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VehicleBadgesService {

  vehicleBadges: VehicleBadge[] = [];

  public vehicleBadgesUrl = this.authService.baseUrl + '/api/vehiclebadges';

  constructor(private authService: AuthService,
              private resourcesService: ResourcesService,
              private http: HttpClient,
              private datePipe: DatePipe) { }

  getVehicleBadges(page = null) : Observable<VehicleBadge[]> {
    if(page == null)
      return this.http.get<VehicleBadge[]>(this.vehicleBadgesUrl);

    return this.http.get<VehicleBadge[]>(this.vehicleBadgesUrl + '/page/' + page);
  }

  getVehicleBadgeById(id: number): Observable<VehicleBadge> {
    return this.http.get<VehicleBadge>(this.vehicleBadgesUrl + '/' + id);
  }

  addVehicleBadge(vehicleBadge: VehicleBadge) {
    return this.http.post(this.vehicleBadgesUrl, vehicleBadge);
  }

  editVehicleBadge(vehicleBadge: VehicleBadge, id: number) {
    return this.http.patch(this.vehicleBadgesUrl + '/' + id, vehicleBadge);
  }

  pushVehicleBadge(vehicleBadge: VehicleBadge) {
    this.vehicleBadges.push(vehicleBadge);
  }

  updateVehicleBadge(vehicleBadge: VehicleBadge, id: number) {
    return this.http.patch(this.vehicleBadgesUrl + '/' + id, vehicleBadge);
  }

  switchVehicleBadge(vehicleBadge: VehicleBadge, id: number) {
    for(let i = 0; i<this.vehicleBadges.length; i++){
      if(this.vehicleBadges[i].id == id){
        this.vehicleBadges[i] = vehicleBadge;
        return this.vehicleBadges[i];
      }
      return null;
    }
    
  }
}
