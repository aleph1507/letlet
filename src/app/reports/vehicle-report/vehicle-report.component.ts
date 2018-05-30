import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.css']
})
export class VehicleReportComponent implements OnInit {

  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Name', field: 'name'},
      {headerName: 'Surname', field: 'surname'},
      {headerName: 'Job Title', field: 'jobTitle'},
      {headerName: 'ID Number', field: 'ID'},
      {headerName: 'Validity Date', field: 'validityDate'},
      {headerName: 'Background Validity Check', field: 'backgroundValidityCheck'},
      {headerName: 'Approved Areas', field: 'approvedAreas'},
      {headerName: 'Date Of Issue', field: 'dateOfIssue'},
      {headerName: 'Status', field: 'status'},
      {headerName: 'Security Awareness Date Of Training', field: 'secAwareDOT'},
      {headerName: 'Proximity Card No', field: 'proximityCardNo'},
      {headerName: 'Code', field: 'code'},
      {headerName: 'Airport', field: 'airport'}
    ]
  };

  rowData = [];

  constructor(private reportsService: ReportsService) { }

  ngOnInit() {
    // this.gridOptions.rowData = this.reportsService.getReports();
    console.log('this.rowData: ' + this.rowData);
  }

}
