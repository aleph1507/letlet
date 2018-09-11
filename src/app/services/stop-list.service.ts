import { Injectable } from '@angular/core';
import { StopListEntry } from '../models/StopListEntry.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StopListService {
  slEntries : StopListEntry[] = [];
  stopListUrl = this.authService.baseUrl + '/api/requests/stoplist';
  httpOptions = {
    headers: this.authService.getHeaders()
  }

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getStopListEntries() : Observable<StopListEntry[]>{
    return this.http.get<StopListEntry[]>(this.stopListUrl, this.httpOptions);
  }
}
