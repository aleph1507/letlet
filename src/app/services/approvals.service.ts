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

  public showApprovals = ['All', 'Approved', 'Declined'];
  public selectedApprovals: string;
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Bearer ' + 'RhLV2Xd_l5NPR9XEKzIuThoXcUdHLnKhTZqykf96kzMQqNBRZJPc26ZIHNBEjXgVrVgsWSGrk6a0iR1S1RwB7uoUAUfeiWZGnYKGlLoYcll3q0OrDX3HdnEOYd24D0eYkSkWR9s_YJSAnOtNXduNliRZMwY5OXy27UTPdxYAKSe1GMgiyJudlaLl2858EZ4x5EH05B5CySoHn_DizrsNO6RkVZczJvWicarx3AjUkHHGdZZYS5EkvfZ54T01CdCn1pGy6rnJMOrgUPzOtW_6ILsYcr1NlSThyJxWbeNUBxCAlUaV7FQFv_Krl9ZasSZ8g5x5GTTORIY0FvGrk7Kbu6rbkIJjPnZbX0xDVjdDGwW0HI_Y8L0Cjo-iQ2TjWHy3MlvGmogRQhxy-WpA0fCm-A',
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
