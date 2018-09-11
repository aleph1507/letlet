import { Component, OnInit } from '@angular/core';
import { ApprovalsService } from '../services/approvals.service';
import { Requester } from '../models/Requester.model';
import { MatTableDataSource, MatRadioGroup, MatRadioButton, MatRadioGroupBase,
  MatRadioButtonBase, MatRadioChange, MatDatepickerInputEvent } from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { ResourcesService } from '../services/resources.service';
import { ApprovalRequest } from '../models/approvalRequest';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Company } from '../models/Company';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {

  approvalRequests : ApprovalRequest[] = [];
  dataSource;
  displayedColumns = ['date', 'requesterName', 'requesterCompany', 'nPersons',
             'nVehicles', 'status', 'approvedDate', 'approvedFrom', 'reqID'];
  showApprovals = [];
  selectedApprovals = 'Not Approved';
  filteredCompanies: Observable<string[]>;
  dateFrom = null;
  dateTo = null;
  page = 1;
  companiesAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];

  showApprovalsSpinner: boolean = true;
  approvalsUrl = this.authService.baseUrl + '/api/requests/approvals/';

  constructor(private approvalsService: ApprovalsService,
              private resourcesService: ResourcesService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private snackbarService: SnackbarService) { }

  toDate : Date;
  fromDate : Date;
  fromString : string = null;
  toString : string = null;
  category = 1;
  nextDisabled:boolean = false;

  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.showApprovals = this.approvalsService.showApprovals;

    this.route.url.subscribe((u) => {
      this.showApprovalsSpinner = true;
      let activatedCategory = +this.route.snapshot.params.selectedradio;
      switch(activatedCategory){
        case 1:
          this.selectedApprovals = 'All'
          this.category = 1;
          break;
        case 2:
          this.selectedApprovals = 'Approved';
          this.category = 2;
          break;
        default:
          this.selectedApprovals = 'Not Approved';
          this.category = 3;
          break;
      }
      this.route.queryParamMap.subscribe(params => {
        if(params.get('sb') == 's'){
            this.snackbarService.successSnackBar("Success!");
        }
      });
      this.getAR();
    });


    this.companiesAutoCtrl.valueChanges
      .subscribe(d => {
        this.resourcesService.companies.filterCompanies(d)
          .subscribe((data: Company[]) => {
            this.companies_auto = data;
            if((this.companiesAutoCtrl.value && this.companiesAutoCtrl.value.id) ||
              (this.companiesAutoCtrl.value == null) || (this.companiesAutoCtrl.value == ''))
              this.getAR();
          });
      });
    this.getAR();
  }

  displayFn(c?: Company) {
    return c ? c.name : undefined;
  }

  status(s) {
    return s == true ? 'Approved' : 'Not Approved';
  }

  displayApprovedFrom(s, f) {
    return s == true ? f : '';
  }

  radioChange($event){
    this.category = this.showApprovals.indexOf($event.value) + 1;
    this.page = 1;
    this.nextDisabled = false;
    this.getAR();
  }

  getAR(picker = null, event: MatDatepickerInputEvent<Date> = null) {
    var month : string = '';
    var day : string = '';

    if(event == null) {
      this.fromDate.getMonth() >= 9 ?
        month = '-' + (this.fromDate.getMonth() + 1).toString() : month = '-0' + (this.fromDate.getMonth()+1).toString();

      this.fromDate.getDate() >= 10 ?
        day = '-' + (this.fromDate.getDate()).toString() : day = '-0' + (this.fromDate.getDate()).toString();

      this.fromString = this.fromDate.getFullYear() + month + day;

      this.toDate.getMonth() >= 9 ?
        month = '-' + (this.toDate.getMonth() + 1).toString() : month = '-0' + (this.toDate.getMonth()+1).toString();

      this.toDate.getDate() >= 10 ?
        day = '-' + (this.toDate.getDate()).toString() : day = '-0' + (this.toDate.getDate()).toString();

      this.toString = this.toDate.getFullYear() + month + day;

    } else {
      event.value.getMonth() >= 9 ?
        month = '-' + (event.value.getMonth() + 1).toString() : month = '-0' + (event.value.getMonth() + 1).toString();

      // event.value.get
      event.value.getDate() >= 10 ?
        day = '-' + (event.value.getDate()).toString() : day = '-0' + (event.value.getDate()).toString();

      picker == 'from' ? this.fromString = event.value.getFullYear() + month + day :
                        this.toString = event.value.getFullYear() + month + day;

    }

    let cSegment = (this.companiesAutoCtrl.value == null ? '' :
      (this.companiesAutoCtrl.value.id == undefined ? '' : '?companyId=' + this.companiesAutoCtrl.value.id));

    if(this.page == 0) this.page = 1;

    var aUrl = this.approvalsUrl + this.category + '/' + this.fromString + '/' + this.toString + '/' + this.page
      + cSegment;

    if(this.fromString != null && this.toString != null){
      this.approvalsService.getRequests(aUrl)
        .subscribe((data : ApprovalRequest[]) => {
            this.approvalRequests = data;
            this.dataSource = new
            MatTableDataSource<ApprovalRequest>(this.approvalRequests);
            this.showApprovalsSpinner = false;
        });
    }

  }

  nextPage(){
    this.page++;
    this.getAR();
  }

  prevPage(){
    if(this.page > 1) {
      this.page--;
      this.nextDisabled = false;
      this.getAR();
    }
  }

}
