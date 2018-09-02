import { Component, OnInit } from '@angular/core';
import { ShreddingReport } from '../../models/ShreddingReport';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from '../../services/auth.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { MatDatepickerInputEvent } from '@angular/material';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-shredding-report',
  templateUrl: './shredding-report.component.html',
  styleUrls: ['./shredding-report.component.css']
})
export class ShreddingReportComponent implements OnInit {
  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  personsReport : ShreddingReport[];

  shreddingsReportUrl = this.authService.baseUrl + '/api/badges/shreddingreport/';
  gotRowData: boolean = false;

  showSpinner : boolean  = true;
  showReports = [];
  category = 0;

  xlsx_report;

  columns = ['Shredding Date', 'Type Of Card', 'Details', 'Card Number',
     'Shredding By'];


  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Shredding Date', field: 'shreddingDate'},
      {headerName: 'Type Of Card', field: 'typeOfCard'},
      {headerName: 'Details', field: 'details'},
      {headerName: 'Card Number', field: 'cardNumber'},
      {headerName: 'Shredding By', field: 'shreddingBy'}
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
    this.showReports = this.reportsService.showReports;
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getReps();
  }

  radioChange($event){
    this.category = this.showReports.indexOf($event.value) + 1;
    this.getReps();
  }

  export_to_xlsx() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.xlsx_report);
    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ShreddingsReport');
    XLSX.writeFile(workBook, 'ShreddingsReport.xlsx');
  }

  // columns = ['Company Name', 'Person', 'Entered Through Gate', 'Entry Approved By',
  //    'Entry Escorted By', 'Exited Through Gate', 'Exit Approved By', 'Exit Escorted By',
  //    'Time On Air Side'];


  shredingDate: string;
  typeOfCard: string;
  details: string;
  cardNumber: number;
  shreddingBy: string;

     export_to_pdf() {
       // console.log('this.xlsx_report: ', this.xlsx_report);
       let body = [];
       body.push(this.columns);
       let tmp = [];
       for(let i = 0; i<this.xlsx_report.length; i++){
         tmp.push(this.xlsx_report[i].shreddingDate, this.xlsx_report[i].typeOfCard,
                  this.xlsx_report[i].details, this.xlsx_report[i].cardNumber,
                  this.xlsx_report[i].shreddingBy);
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
               widths: ['auto', 'auto', 'auto', 'auto', 'auto'],

               body: body
             }
           }
         ]
       }
      pdfMake.createPdf(docDefinition).download('ShreddingsReport.pdf');
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
    this.showSpinner = true;
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


    var rUrl = this.shreddingsReportUrl + this.category + '/' + this.fromString + '/' + this.toString;
    console.log(`aUrl: ` + rUrl);

    if(this.fromString != null && this.toString != null){
      this.reportsService.getShreddingsReports(rUrl)
        .subscribe((data : ShreddingReport[]) => {
          // this.gridOptions.onGridReady = function() {
            for(let i = 0; i<data.length; i++){
              data[i].shreddingDate = data[i].shreddingDate.split('.')[0];
            }
            this.xlsx_report = data;
            console.log('xlsx_report: ', this.xlsx_report);
            // console.log('this.xlsx_report', this.xlsx_report);
            this.gridOptions.api.setRowData(data);
            this.showSpinner = false;
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
