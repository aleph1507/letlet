import { Component, OnInit } from '@angular/core';
import { ApprovalsService } from '../services/approvals.service';
import { Requester } from '../models/Requester.model';
import { MatTableDataSource, MatRadioGroup, MatRadioButton, MatRadioGroupBase,
  MatRadioButtonBase, MatRadioChange } from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {

  approvalRequests = [];
  dataSource;
  displayedColumns = ['date', 'requesterName', 'requesterCompany', 'nPersons',
             'nVehicles', 'status', 'approvedDate', 'approvedFrom', 'reqID'];
  showApprovals = ['All', 'Approved', 'Declined'];
  selectedApprovals = 'All';
  filteredCompanies: Observable<string[]>;

  companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];
  fCompany: FormControl = new FormControl();



  constructor(private approvalsService: ApprovalsService) { }

  ngOnInit() {
    this.approvalRequests = this.approvalsService.formatRequests();
    this.dataSource = new MatTableDataSource(this.approvalRequests);
    this.filteredCompanies = this.fCompany.valueChanges
      .pipe(
        startWith(''),
        map(company => this.filterCompanies(company))
      );
  }

  filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

}
