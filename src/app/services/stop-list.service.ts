import { Injectable } from '@angular/core';
import { StopListEntry } from '../models/StopListEntry.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StopListService {

  // slEntry: StopListEntry;
  // sampleSlArray: StopListEntry[] = [
  //   {
  //     name: "name1",
  //     surname: "surname1",
  //     jobTitle: "string",
  //     ID: 123,
  //     validityDate: Date.now(),
  //     backgroundValidityCheck: true,
  //     approvedAreas: ['aaa','bbb'],
  //     dateOfIssue: Date.now(),
  //     status: Status.Active,
  //     secAwareDOT: Date.now(),
  //     proximityCardNo: 123,
  //     code: "codestring",
  //     airport: "airportstring",
  //   },
  //   {
  //     name: "name2",
  //     surname: "surname2",
  //     jobTitle: "jt2",
  //     ID: 321,
  //     validityDate: Date.now(),
  //     backgroundValidityCheck: false,
  //     approvedAreas: ['ccc','ddd'],
  //     dateOfIssue: Date.now(),
  //     status: Status.Lost,
  //     secAwareDOT: Date.now(),
  //     proximityCardNo: 321,
  //     code: "codestring213",
  //     airport: "airportstringletlet",
  //   },
  //   {
  //     name: "name3",
  //     surname: "surname3",
  //     jobTitle: "jt3",
  //     ID: 333,
  //     validityDate: Date.now(),
  //     backgroundValidityCheck: true,
  //     approvedAreas: ['eee','fff'],
  //     dateOfIssue: Date.now(),
  //     status: Status.Return,
  //     secAwareDOT: Date.now(),
  //     proximityCardNo: 333,
  //     code: "codestring333",
  //     airport: "333airportstringletlet",
  //   }
  // ];
  // slArray: StopListEntry[] = [];

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

  // fillSampleSlArray() {
  //   for(let i = 0; i<700; i++){
  //     this.slArray.push(...this.sampleSlArray);
  //   }
  // }
  //
  // getStopListEntries() {
  //   this.fillSampleSlArray();
  //   return this.slArray;
  // }

}
