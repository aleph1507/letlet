import { Injectable } from '@angular/core';
import { VehicleStopListEntry } from '../models/VehicleStopListEntry';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VslService {

  vslEntries : VehicleStopListEntry[] = [];
  vehicleStopListUrl = this.authService.baseUrl + '/api/requests/vehiclestoplist';

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getVehicleStopListEntries(): Observable<VehicleStopListEntry[]> {
    return this.http.get<VehicleStopListEntry[]>(this.vehicleStopListUrl);
  }

}
