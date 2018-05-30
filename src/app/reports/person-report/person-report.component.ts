import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { PersonReport } from '../../models/PersonReport.model';

@Component({
  selector: 'app-person-report',
  templateUrl: './person-report.component.html',
  styleUrls: ['./person-report.component.css']
})
export class PersonReportComponent implements OnInit {

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  personsReport : PersonReport[];

  personsReportUrl = this.authService.baseUrl + '/api/visits/personreport';
  gotRowData: boolean = false;



  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Person', field: 'personVisited'},
      {headerName: 'Entered Through Gate', field: 'enteredOnGate'},
      {headerName: 'Entry Approved By', field: 'approvedEnterFrom'},
      {headerName: 'Entry Escorted By', field: 'entryEscortedBy'},
      {headerName: 'Exited Through Gate', field: 'exitedOnGate'},
      {headerName: 'Exit Approved By', field: 'approvedExitFrom'},
      {headerName: 'Exit Escorted By', field: 'exitEscortedBy'},
      {headerName: 'Time On Air Side', field: 'timeOnAirSide'}
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
  };

  // rowData = [];

  constructor(private reportsService: ReportsService,
              private authService: AuthService) { }

  ngOnInit() {
    // this.gridOptions.rowData = this.reportsService.getReports();
    // console.log('this.rowData: ' + this.gridOptions.rowData);
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getReps();
  }

  getReps(picker = null, event: MatDatepickerInputEvent<Date> = null) {
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
      // console.log('event.value: ' + event.value);
      var date = null;
      if(picker == 'from'){
        date = this.fromDate;
      } else {
        date = this.toDate;
      }
      date.getMonth() >= 10 ?
        month = '-' + (date.getMonth() + 1).toString() : month = '-0' + (date.getMonth() + 1).toString();

      // event.value.get
      date.getDate() >= 10 ?
        day = '-' + (date.getDate()).toString() : day = '-0' + (date.getDate()).toString();

      picker == 'from' ? this.fromString = date.getFullYear() + month + day :
                        this.toString = date.getFullYear() + month + day;

    }


    var rUrl = this.personsReportUrl + '/' + this.fromString + '/' + this.toString;
    console.log(`aUrl: ` + rUrl);

    if(this.fromString != null && this.toString != null){
      this.reportsService.getReports(rUrl)
        .subscribe((data : PersonReport[]) => {
          // this.gridOptions.onGridReady = function() {
            this.gridOptions.api.setRowData(data);
          // }
          // this.personsReport = data;
          // this.rowData = this.personsReport;
          // console.log('gridoptions row data: ' + this.rowData);
          // this.gotRowData = true;
          // this.dataSource = new
          //   MatTableDataSource<ApprovalRequest>(this.approvalRequests);
          // console.log(this.approvalRequests);
        });
    }

  }

}
