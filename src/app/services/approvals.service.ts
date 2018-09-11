import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { Requester } from '../models/Requester.model';
import { ApprovalRequest } from '../models/approvalRequest';
import { ResourcesService } from './resources.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class ApprovalsService {

  approvalRequests = Array<ApprovalRequest>();
  requests: Requester[];

  public showApprovals = ['All', 'Approved', 'Not Approved'];
  public selectedApprovals: string;

  headers: HttpHeaders = this.authService.getHeaders();

  constructor(private requesterService: RequesterService,
              private resourcesService: ResourcesService,
              private http: HttpClient,
              private authService: AuthService) { }

  getRequests(aUrl : string) : Observable<ApprovalRequest[]> {
    return this.http.get<ApprovalRequest[]>(aUrl);
  }

  getApprovalRequests() {
    return this.approvalRequests;
  }

  formatRequests() {
    this.approvalRequests = [];
    this.requests = this.requesterService.getAllRequests();

    return this.approvalRequests;
  }

}
