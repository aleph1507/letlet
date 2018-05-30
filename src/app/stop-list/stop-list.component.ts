import { Component, OnInit, ViewChild } from '@angular/core';
import { StopListService } from '../services/stop-list.service';
import { StopListEntry } from '../models/StopListEntry.model';
// import { MatTableDataSource, MatSort } from '@angular/material';
import { GridOptions } from 'ag-grid';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.css']
})
export class StopListComponent implements OnInit {

  // slEntries: StopListEntry[];
  // displayedColumns = [
  //   'name', 'surname', 'jobTitle', 'ID', 'validityDate', 'backgroundValidityCheck',
  //   'approvedAreas', 'dateOfIssue', 'status', 'secAwareDOT', 'proximityCardNo',
  //   'code', 'airport'
  // ];

  // columnDefs = [
  //   {headerName: 'Name', field: 'name'},
  //   {headerName: 'Surname', field: 'surname'},
  //   {headerName: 'Job Title', field: 'jobTitle'},
  //   {headerName: 'ID Number', field: 'ID'},
  //   {headerName: 'Validity Date', field: 'validityDate'},
  //   {headerName: 'Background Validity Check', field: 'backgroundValidityCheck'},
  //   {headerName: 'Approved Areas', field: 'approvedAreas'},
  //   {headerName: 'Date Of Issue', field: 'dateOfIssue'},
  //   {headerName: 'Status', field: 'status'},
  //   {headerName: 'Security Awareness Date Of Training', field: 'secAwareDOT'},
  //   {headerName: 'Proximity Card No', field: 'proximityCardNo'},
  //   {headerName: 'Code', field: 'code'},
  //   {headerName: 'Airport', field: 'airport'}
  // ];

  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Employee Name', field: 'employeeName'},
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Card Series Number', field: 'cardSeriesNumber'},
      {headerName: 'Card Number', field: 'cardNumber'},
      {headerName: 'Expire Date', field: 'expireDate'},
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
  };

  // rowData = [];

  // @ViewChild(MatSort) sort: MatSort;

  // slDataSource;

  constructor(private slService: StopListService) { }

  ngOnInit() {
    this.slService.getStopListEntries()
      .subscribe((data : StopListEntry[]) => {
        this.gridOptions.api.setRowData(data);
      });
    // this.slEntries = this.slService.getStopListEntries();
    // this.slDataSource = new MatTableDataSource(this.slEntries);
    // this.slDataSource.sort = this.sort;
    // this.gridOptions.rowData = this.slService.getStopListEntries();
    // console.log('this.rowData: ' + this.rowData);
  }

  // applyFilter(filterValue: string) {
    // filterValue = filterValue.trim();
    // filterValue = filterValue.toLowerCase();
    // this.slDataSource.filter = filterValue;
  // }

}
