import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { PersonReport } from '../../models/PersonReport.model';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-person-report',
  templateUrl: './person-report.component.html',
  styleUrls: ['./person-report.component.css']
})
export class PersonReportComponent implements OnInit {

  // EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // EXCEL_EXTENSION = '.xlsx';

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  personsReport : PersonReport[];

  personsReportUrl = this.authService.baseUrl + '/api/visits/personreport';
  gotRowData: boolean = false;

  xlsx_report;

  columns = ['Company Name', 'Person', 'Entered Through Gate', 'Entry Approved By',
     'Entry Escorted By', 'Exited Through Gate', 'Exit Approved By', 'Exit Escorted By',
     'Time On Air Side'];


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

  export_to_xlsx() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.xlsx_report);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'PersonsReport');
    XLSX.writeFile(workBook, 'PersonsReport.xlsx');
  }

  // columns = ['Company Name', 'Person', 'Entered Through Gate', 'Entry Approved By',
  //    'Entry Escorted By', 'Exited Through Gate', 'Exit Approved By', 'Exit Escorted By',
  //    'Time On Air Side'];

     export_to_pdf() {
       // console.log('this.xlsx_report: ', this.xlsx_report);
       let body = [];
       body.push(this.columns);
       let tmp = [];
       for(let i = 0; i<this.xlsx_report.length; i++){
         tmp.push(this.xlsx_report[i].companyName, this.xlsx_report[i].personVisited,
                  this.xlsx_report[i].enteredOnGate, this.xlsx_report[i].approvedEnterFrom,
                  this.xlsx_report[i].entryEscortedBy, this.xlsx_report[i].exitedOnGate,
                  this.xlsx_report[i].approvedExitFrom, this.xlsx_report[i].exitEscortedBy,
                  this.xlsx_report[i].timeOnAirSide);
         body.push(tmp);
         tmp = [];
       }
       // console.log('body: ', body);
       let docDefinition = {

       extend: 'pdfHtml5',
       // orientation: 'landscape',//landscape give you more space
       pageSize: 'A3',//A0 is the largest A5 smallest(A0,A1,A2,A3,legal,A4,A5,letter))
       alignment: 'center',

       content: [
           {
             // alignment: 'center',
             table: {
               headerRows: 1,
               widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

               body: body
             }
           }
         ]
       }
      pdfMake.createPdf(docDefinition).download('PersonsReport.pdf');
     }

  // export_to_xlsx(){
  //   /* generate worksheet */
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.xlsx_report);
  //
  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'personsReport');
  //
  //   /* save to file */
  //   XLSX.writeFile(wb, 'personsReport.xlsx');
  // }

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
            this.xlsx_report = data;
            // console.log('this.xlsx_report', this.xlsx_report);
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
