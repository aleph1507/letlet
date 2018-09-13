import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Badge } from '../models/Badge.model';
import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { retry } from 'rxjs/operator/retry';
import { AuthService } from './auth.service';


@Injectable()
export class BadgesService {

  companies = this.resources.companies.getCompaniesNames();
  badges: Badge[] = [];

  public badgesUrl = this.authService.baseUrl + '/api/badges'; //shredding/id

  httpOptions = {
    headers: this.authService.getHeaders()
  }

  constructor(private resources: ResourcesService,
              public datePipe: DatePipe,
              private http: HttpClient,
              private authService: AuthService) { }

  getBadges(page = null) : Observable<Badge[]>{
    if(page == null)
      return this.http.get<Badge[]>(this.badgesUrl, this.httpOptions);

    return this.http.get<Badge[]>(this.badgesUrl + '/page/' + page, this.httpOptions);
  }

  deactivate(id, deactivateReason) {
    let params = new HttpParams()
      .set('deactivateReason', deactivateReason);
    return this.http.post<boolean>(this.badgesUrl + '/deactivate/' + id + '?deactivateReason='+deactivateReason, {});
  }

  activate(id){
    return this.http.post<boolean>(this.badgesUrl + '/activate/' + id, {});
  }

  getBadgeById(id: number) : Observable<Badge>{
    return this.http.get<Badge>(this.badgesUrl + '/' + id, this.httpOptions);
  }

  addBadge(badge: Badge){
    return this.http.post(this.badgesUrl, badge, this.httpOptions);
  }

  editBadge(badge: Badge, id:number){
    return this.http.patch(this.badgesUrl + '/' + id, badge);
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

  shredBadge(id: number){
    return this.http.post(this.badgesUrl + '/shredding/' + id, {});
  }

  filterBadges(filter = null) : Observable<Badge[]>{
    return this.http.get<Badge[]>(this.badgesUrl + '/search/?token=' + filter);
  }

}
