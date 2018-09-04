import { Component, OnInit } from '@angular/core';
import { BadgeReport } from '../../models/BadgeReport';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ActivatedRoute } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-badgereport',
  templateUrl: './badgereport.component.html',
  styleUrls: ['./badgereport.component.css']
})
export class BadgereportComponent implements OnInit {

  vehicleBadgeReports : BadgeReport[];

  showSpinner : boolean = true;

  category: number = 0;
  categories = ['Active', 'All'];

  badgesReportUrl = this.authService.baseUrl + '/api/badges/badgereport';

  xlsx_report = null;

  columns = ['Badge Number', 'Employee Name', 'Employee Surname', 'Occupation', 'Company Name',
    'Company Name in English', 'Card Series Number', 'Card Number', 'Date of Activation',
    'Date of Security Check', 'Date of Training', 'Expire Date', 'Payment',
    'Returned', 'Deactivated', 'Reason for Deactivation', 'Shredding Date'];

   public gridOptions: GridOptions = <GridOptions>{
     rowData: [],
     columnDefs: [
       {headerName: 'Badge Number', field: 'badgeNumber'},
       {headerName: 'Employee Name', field: 'employeeName'},
       {headerName: 'Employee Surname', field: 'employeeSurname'},
       {headerName: 'Occupation', field: 'occupation'},
       {headerName: 'Company Name', field: 'companyName'},
       {headerName: 'Company Name in English', field: 'companyNameEn'},
       {headerName: 'Card Series Number', field: 'cardSeriesNumber'},
       {headerName: 'Card Number', field: 'cardNumber'},
       {headerName: 'Date of Activation', field: 'dateOfActivation'},
       {headerName: 'Date of Security Check', field: 'dateOfSecurityCheck'},
       {headerName: 'Date of Training', field: 'dateOfTraining'},
       {headerName: 'Expire Date', field: 'expireDate'},
       {headerName: 'Payment', field: 'payment'},
       {headerName: 'Returned', field: 'returned'},
       {headerName: 'Deactivated', field: 'deactivated'},
       {headerName: 'Reason for Deactivation', field: 'deactivateReason'},
       {headerName: 'Shredding Date', field: 'shreddingDate'},
     ],
     enableCellChangeFlash: true,
     refreshCells: true,
     enableFilter: true,
     enableSorting: true,
     onGridReady: () => {
         console.log('grid ready...');
         this.loadRowData();
     }
   };

  constructor(private reportsService: ReportsService,
              private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.getReps();
  }

  radioChange($event){
    console.log('event.value', $event.value);
    this.category = $event.value;
    console.log('this.category: ', this.category);
    this.getReps(this.category);
    // this.getAR();
  }

  loadRowData() {
    this.showSpinner = false;
    this.gridOptions.api.setRowData(this.xlsx_report);
  }

  export_to_xlsx() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.xlsx_report);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'BadgesReport');
    XLSX.writeFile(workBook, 'BadgesReport.xlsx');
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [];

    for(let i = 0; i<this.xlsx_report.length; i++){
      tmp.push(this.xlsx_report[i].badgeNumber, this.xlsx_report[i].employeeName, this.xlsx_report[i].employeeSurname, this.xlsx_report[i].occupation,
               this.xlsx_report[i].companyName, this.xlsx_report[i].companyNameEn, this.xlsx_report[i].cardSeriesNumber,
               this.xlsx_report[i].cardNumber, this.xlsx_report[i].dateOfActivation.toString(), this.xlsx_report[i].dateOfSecurityCheck.toString(),
               this.xlsx_report[i].dateOfTraining.toString(), this.xlsx_report[i].expireDate.toString(), this.xlsx_report[i].payment,
               this.xlsx_report[i].returned, this.xlsx_report[i].deactivated, this.xlsx_report[i].deactivateReason, this.xlsx_report[i].shreddingDate.toString());
      body.push(tmp);
      tmp = [];
    }
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
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

            body: body
          }
        }
      ]
    }
   pdfMake.createPdf(docDefinition).download('BadgesReport.pdf');
  }

  getReps(c = 0) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';

    var rUrl = this.badgesReportUrl + '/' + c.toString();

    this.reportsService.getBadgesReports(rUrl)
      .subscribe((data : BadgeReport[]) => {
        console.log('vo subscribtion, data: ', data);
        this.xlsx_report = data;
        if(this.gridOptions.api)
          this.loadRowData();
      });
  }

}
