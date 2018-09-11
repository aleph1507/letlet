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
import { AsptonormaldatePipe } from '../../shared/pipes/asptonormaldate.pipe';
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

  rowCount = '';

  shreddingsReportUrl = this.authService.baseUrl + '/api/badges/shreddingreport/';
  gotRowData: boolean = false;

  showSpinner : boolean  = true;
  showReports = [];
  category = 0;

  selectedReports;

  xlsx_report;

  columns = ['Shredding Date', 'Type Of Card', 'Details', 'Card Number',
     'Shredding By'];


  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Index', field: 'index'},
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
              private authService: AuthService,
              private atndp: AsptonormaldatePipe) { }

  ngOnInit() {
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
    let tmpX = this.xlsx_report;
    for(let i = 0; i<tmpX.length; i++){
      delete tmpX[i].index;
    }
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(tmpX);
    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ShreddingsReport');
    XLSX.writeFile(workBook, 'ShreddingsReport.xlsx');
  }

  shredingDate: string;
  typeOfCard: string;
  details: string;
  cardNumber: number;
  shreddingBy: string;

     export_to_pdf() {
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
       let docDefinition = {

       extend: 'pdfHtml5',
       pageSize: 'A3',
       alignment: 'center',

       content: [
           {
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

  getReps(picker = null, event: MatDatepickerInputEvent<Date> = null) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';

    if(event == null) {
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
      var date = null;
      if(picker == 'from'){
        date = this.fromDate;
      } else {
        date = this.toDate;
      }
      date.getMonth() >= 10 ?
        month = '-' + (date.getMonth() + 1).toString() : month = '-0' + (date.getMonth() + 1).toString();

      date.getDate() >= 10 ?
        day = '-' + (date.getDate()).toString() : day = '-0' + (date.getDate()).toString();

      picker == 'from' ? this.fromString = date.getFullYear() + month + day :
                        this.toString = date.getFullYear() + month + day;

    }


    var rUrl = this.shreddingsReportUrl + this.category + '/' + this.fromString + '/' + this.toString;

    if(this.fromString != null && this.toString != null){
      this.reportsService.getShreddingsReports(rUrl)
        .subscribe((data : ShreddingReport[]) => {
          this.rowCount = 'Number of rows: ' + data.length.toString();
          // this.gridOptions.onGridReady = function() {
            for(let i = 0; i<data.length; i++){
              data[i].index = i+1;
              data[i].shreddingDate = data[i].shreddingDate.split('.')[0];
              if(data[i].shreddingDate != null) data[i].shreddingDate = this.atndp.transform(data[i].shreddingDate.toString());
            }
            this.xlsx_report = data;
            this.gridOptions.api.setRowData(data);
            this.showSpinner = false;
        });
    }

  }

  }
