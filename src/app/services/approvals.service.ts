import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { Requester } from '../models/Requester.model';
import { ApprovalRequest } from '../models/approvalRequest';
import { ResourcesService } from './resources.service';

@Injectable()
export class ApprovalsService {

  approvalRequests = Array<ApprovalRequest>();
  requests: Requester[];

  constructor(private requesterService: RequesterService,
              private resourcesService: ResourcesService) { }

  getRequests() {
    this.requests = this.requesterService.getAllRequests();
    return this.requests;
  }

  getApprovalRequests() {
    return this.approvalRequests;
  }

  formatRequests() {
    this.approvalRequests = [];
    this.requests = this.requesterService.getAllRequests();



    for(let i =0; i<this.requests.length; i++){
      let ar = new ApprovalRequest();
      ar.date = this.requests[i].date;
      ar.requesterName = this.requests[i].requesterName;
      ar.requesterCompany = this.requests[i].company;
      ar.nPersons = this.requests[i].persons.length;
      ar.nVehicles = this.requests[i].vehicles.length;
      ar.status = (i % 2 == 0);
      ar.approvedDate = Date.now();
      ar.approvedFrom = i.toString();
      ar.reqID = this.requests[i].requestID;
      this.approvalRequests.push(ar);
    }

    return this.approvalRequests;
  }

}
