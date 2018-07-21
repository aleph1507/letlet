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
  // showApprovals = ['Unverified', 'All', 'Approved', 'Declined'];
  showApprovals = [];
  selectedApprovals = 'Not Approved';
  filteredCompanies: Observable<string[]>;
  dateFrom = null;
  dateTo = null;
  page = 1;
  companiesAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];

  // companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  // companies = this.resourcesService.companies.getCompaniesNames();
  // fCompany: FormControl = new FormControl();

  // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/3/2018-01-01/2019-01-01';
  // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/';
  approvalsUrl = this.authService.baseUrl + '/api/requests/approvals/';

  constructor(private approvalsService: ApprovalsService,
              private resourcesService: ResourcesService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  toDate : Date;
  fromDate : Date;
  fromString : string = null;
  toString : string = null;

  ngOnInit() {
    this.route.url.subscribe((u) => {
      let activatedCategory = +this.route.snapshot.params.selectedradio;
      switch(activatedCategory){
        case 1:
          this.selectedApprovals = 'All'
          break;
        case 2:
          this.selectedApprovals = 'Approved';
          break;
        default:
          this.selectedApprovals = 'Not Approved';
          break;
      }
      console.log('this.route.snapshot.params.selectedradio:  ' + this.route.snapshot.params.selectedradio);
    });
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    // this.approvalRequests = this.approvalsService.formatRequests();
    this.showApprovals = this.approvalsService.showApprovals;
    // console.log('showApprovals[0]: ' + this.showApprovals[0]);
    // this.dataSource = new MatTableDataSource(this.approvalRequests);

    this.companiesAutoCtrl.valueChanges
      .subscribe(d => {
        this.resourcesService.companies.filterCompanies(d)
          .subscribe((data: Company[]) => {
            console.log('companies: ', data);
            this.companies_auto = data;
            if(this.companiesAutoCtrl.value && this.companiesAutoCtrl.value.id)
              this.getAR();
          });
      });

    //
    // this.filteredCompanies = this.fCompany.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(company => this.filterCompanies(company))
    //   );

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

  category = 3;

  radioChange($event){
    this.category = this.showApprovals.indexOf($event.value) + 1;
    this.getAR();
  }

  getAR(picker = null, event: MatDatepickerInputEvent<Date> = null) {
    var month : string = '';
    var day : string = '';

    if(event == null) {
      // console.log('vo event == null');
      this.fromDate.getMonth() >= 10 ?
        month = '-' + (this.fromDate.getMonth() + 1).toString() : month = '-0' + (this.fromDate.getMonth()+1).toString();

      this.fromDate.getDate() >= 10 ?
        day = '-' + (this.fromDate.getDate()).toString() : day = '-0' + (this.fromDate.getDate()).toString();

      this.fromString = this.fromDate.getFullYear() + month + day;

      this.toDate.getMonth() >= 10 ?
        month = '-' + (this.toDate.getMonth() + 1).toString() : month = '-0' + (this.toDate.getMonth()+1).toString();

      this.toDate.getDate() >= 10 ?
        day = '-' + (this.toDate.getDate()).toString() : day = '-0' + (this.toDate.getDate()).toString();

      this.toString = this.toDate.getFullYear() + month + day;

    } else {
      event.value.getMonth() >= 10 ?
        month = '-' + (event.value.getMonth() + 1).toString() : month = '-0' + (event.value.getMonth() + 1).toString();

      // event.value.get
      event.value.getDate() >= 10 ?
        day = '-' + (event.value.getDate()).toString() : day = '-0' + (event.value.getDate()).toString();

      picker == 'from' ? this.fromString = event.value.getFullYear() + month + day :
                        this.toString = event.value.getFullYear() + month + day;

    }

    console.log('this.companiesAutoCtrl.value', this.companiesAutoCtrl.value);

    let cSegment = (this.companiesAutoCtrl.value == null ? '' :
      (this.companiesAutoCtrl.value.id == undefined ? '' : '?companyId=' + this.companiesAutoCtrl.value.id));

    var aUrl = this.approvalsUrl + this.category + '/' + this.fromString + '/' + this.toString + '/' + this.page
      + cSegment;
    console.log(`aUrl: ` + aUrl);

    if(this.fromString != null && this.toString != null){
      this.approvalsService.getRequests(aUrl)
        .subscribe((data : ApprovalRequest[]) => {
          this.approvalRequests = data;
          this.dataSource = new
            MatTableDataSource<ApprovalRequest>(this.approvalRequests);
          // console.log(this.approvalRequests);
        })
    }

  }

  // filterCompanies(name: string) {
  //   return this.companies.filter(company =>
  //     company.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }

}
