import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { Requester } from '../models/Requester.model';
import { ApprovalRequest } from '../models/approvalRequest';
import { ResourcesService } from './resources.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApprovalsService {

  approvalRequests = Array<ApprovalRequest>();
  requests: Requester[];

  // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/3/2018-01-01/2019-01-01';
  // 1 - all | 2 - approved | 3- not approved
  // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/3/2018-01-01/2019-01-01';

  public showApprovals = ['All', 'Approved', 'Not Approved'];
  public selectedApprovals: string;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer ' + 'OVdSQO8unD8O7jCsDBBqNnmbiLHbtR5h7jg_iA3SP8Wxc7TPFkcxXgy7TO5WZX9vBdD_GxDM0jtFMpzSTlx8Ooe5jNhbyflfYCZPfswkLY4POCso_ysWeUg_98y_8sWQvFVnkbmNRWKRqHCmLzOhGRrVjduJ8ORgTk3eScYc_R2fpiGHE1KBvfzPnuSOhvgpIFy-1B-FlxmZwbNz3wloSHHtklUdRkfelAZSKBGBJ5MH3dxgnbsau22Qm8muhXCE09FplfiqFq5B7KNMjEDd6vh-T0MQG8aDoARGVqA-VHwFShUvFKmY_4sjvmaCNYRAfbQf4c_wPdkmR6vqhYePAUK3oDI-50dQfgdGkBNcQN8aamujiKouRhnNSNRuXZ81s_MAdcBqyIrwJdc7khG6tg',
    'Accept': 'application/json'
  })

  constructor(private requesterService: RequesterService,
              private resourcesService: ResourcesService,
              private http: HttpClient) { }

  getRequests(aUrl : string) : Observable<ApprovalRequest[]> {
    return this.http.get<ApprovalRequest[]>(aUrl, { headers: this.headers });
    // this.requests = this.requesterService.getAllRequests();
    // return this.requests;
  }

  getApprovalRequests() {
    // this.http.get<ApprovalRequest[]>()
    return this.approvalRequests;
  }

  formatRequests() {
    this.approvalRequests = [];
    this.requests = this.requesterService.getAllRequests();



    // for(let i =0; i<this.requests.length; i++){
    //   let ar = new ApprovalRequest();
    //   // ar.date = this.requests[i].date;
    //   ar.requesterName = this.requests[i].requesterName;
    //   ar.requesterCompany = this.requests[i].company;
    //   ar.nPersons = this.requests[i].persons.length;
    //   ar.nVehicles = this.requests[i].vehicles.length;
    //   ar.status = (i % 2 == 0);
    //   ar.approvedDate = Date.now();
    //   ar.approvedFrom = i.toString();
    //   ar.reqID = this.requests[i].requestID;
    //   this.approvalRequests.push(ar);
    // }

    return this.approvalRequests;
  }

}
