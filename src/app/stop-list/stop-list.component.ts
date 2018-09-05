import { Component, OnInit, ViewChild } from '@angular/core';
import { StopListService } from '../services/stop-list.service';
import { StopListEntry } from '../models/StopListEntry.model';
// import { MatTableDataSource, MatSort } from '@angular/material';
import { GridOptions } from 'ag-grid';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { AsptonormaldatePipe } from '../shared/pipes/asptonormaldate.pipe';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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

  xlsx_report;
  columns = ['Employee Name', 'Company Name', 'Card Series Number', 'Card Number', 'Badge number', 'Expire Date'];

  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Employee Name', field: 'employeeName'},
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Card Series Number', field: 'cardSeriesNumber'},
      {headerName: 'Card Number', field: 'cardNumber'},
      {headerName: 'Badge Number', field: 'badgeNumber'},
      {headerName: 'Expire Date', field: 'expireDate'},
      {headerName: 'Reason', field: 'deactivateReason'}
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
  };

  export_to_xlsx() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.xlsx_report);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'StopList');
    XLSX.writeFile(workBook, 'StopList.xlsx');
  }

  // columns = ['Employee Name', 'Company Name', 'Card Series Number', 'Card Number', 'Expire Date'];

  export_to_pdf() {
    // console.log('this.xlsx_report: ', this.xlsx_report);
    let body = [];
    body.push(this.columns);
    let tmp = [];
    for(let i = 0; i<this.xlsx_report.length; i++){
      tmp.push(this.xlsx_report[i].employeeName, this.xlsx_report[i].companyName, this.xlsx_report[i].cardSeriesNumber,
              this.xlsx_report[i].cardNumber, this.xlsx_report[i].expireDate);
      body.push(tmp);
      tmp = [];
    }
    // console.log('body: ', body);
    let docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 100, '*', '*'],

            body: body
          }
        }
      ]
    }
   pdfMake.createPdf(docDefinition).download('StopList.pdf');
  }
  // rowData = [];

  // @ViewChild(MatSort) sort: MatSort;

  // slDataSource;

  constructor(private slService: StopListService) { }

  ngOnInit() {
    this.slService.getStopListEntries()
      .subscribe((data : StopListEntry[]) => {
        this.xlsx_report = data;
        let atndPipe = new AsptonormaldatePipe();
        for(let i = 0; i<this.xlsx_report.length; i++){
          this.xlsx_report[i].expireDate = atndPipe.transform(this.xlsx_report[i].expireDate);
        }
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
