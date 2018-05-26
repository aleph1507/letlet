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
  selectedApprovals = 'All';
  filteredCompanies: Observable<string[]>;
  dateFrom = null;
  dateTo = null;

  // companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  companies = this.resourcesService.companies.getCompaniesNames();
  fCompany: FormControl = new FormControl();

  // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/3/2018-01-01/2019-01-01';
  approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/';

  constructor(private approvalsService: ApprovalsService,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    // this.approvalRequests = this.approvalsService.formatRequests();
    this.showApprovals = this.approvalsService.showApprovals;
    // console.log('showApprovals[0]: ' + this.showApprovals[0]);
    this.dataSource = new MatTableDataSource(this.approvalRequests);
    this.filteredCompanies = this.fCompany.valueChanges
      .pipe(
        startWith(''),
        map(company => this.filterCompanies(company))
      );
  }
  fromString : string = null;
  toString : string = null;
  getAR(picker, event: MatDatepickerInputEvent<Date>) {
    var category = (this.showApprovals.indexOf(this.selectedApprovals) + 1).toString();

    var month : string = '';
    var day : string = '';
    // approvalsUrl = 'http://192.168.100.4:84/api/requests/approvals/3/2018-01-01/2019-01-01';
    // this.approvalsUrl += category += '/'


    event.value.getMonth() >= 10 ?
      month = '-' + (event.value.getMonth() + 1).toString() : month = '-0' + (event.value.getMonth() + 1).toString();

    // event.value.get
    event.value.getDate() >= 10 ?
      day = '-' + (event.value.getDate()).toString() : day = '-0' + (event.value.getDate()).toString();

      // console.log('month : ' + month + ' ,  day: ' + day);

    picker == 'from' ? this.fromString = event.value.getFullYear() + month + day :
                      this.toString = event.value.getFullYear() + month + day;

    // console.log('fromString: ' + this.fromString + ', toString: ' + this.toString);

    var aUrl = this.approvalsUrl + category + '/' + this.fromString + '/' + this.toString;

    if(this.fromString != null && this.toString != null){
      this.approvalsService.getRequests(aUrl)
        .subscribe((data : ApprovalRequest[]) => {
          this.approvalRequests = data;
        })
    }

    // console.log('aUrl: ' + aUrl);

    // console.log('category: ' + category + ', picker: ' + picker + ', event.value: ' + event.value +
    //   ', event.value.getDay: ' + event.value.getDay() + ', event.value.getMonth: ' + event.value.getMonth()
    //   + ', event.value: ' + event.value.getFullYear());
  }

  filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

}
