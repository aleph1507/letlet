import { Component, OnInit } from '@angular/core';
import { BadgeReport } from '../../models/BadgeReport';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ActivatedRoute } from '@angular/router';
import { AsptonormaldatePipe } from '../../shared/pipes/asptonormaldate.pipe';
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
  categories = ['Active and Valid', 'Active', 'All', ];


  rowCount = '';

  badgesReportUrl = this.authService.baseUrl + '/api/badges/badgereport';

  xlsx_report = null;

  nRowsDisplay;

  columns = ['Badge Number', 'Employee Name', 'Employee Surname', 'Occupation', 'Company Name',
    'Company Name in English', 'Card Series Number', 'Card Number', 'Date of Activation',
    'Date of Security Check', 'Date of Training', 'Expire Date', 'Payment',
    'Returned', 'Deactivated', 'Reason for Deactivation', 'Shredding Date'];

   public gridOptions: GridOptions = <GridOptions>{
     context: {
       componentParent: this
     },
     enableFilter: true,
     floatingFilter: true,
     rowData: [],
     columnDefs: [
       {headerName: 'Index', valueGetter: (args) => args.node.rowIndex + 1},
       {headerName: 'Badge Number', field: 'badgeNumber'},
       {headerName: 'Employee Name', field: 'employeeName'},
       {headerName: 'Employee Surname', field: 'employeeSurname'},
       {headerName: 'Occupation', field: 'occupation'},
       {headerName: 'Company Name', field: 'companyName'},
       {headerName: 'Company Name in English', field: 'companyNameEn'},
       {headerName: 'Card Series Number', field: 'cardSeriesNumber'},
       {headerName: 'Card Number', field: 'cardNumber'},
       {headerName: 'Date of Activation', field: 'dateOfActivation', filter: 'agDateColumnFilter',
       filterParams:{

           // provide comparator function
           comparator: function (filterLocalDateAtMidnight, cellValue) {

               // In the example application, dates are stored as dd/mm/yyyy
               // We create a Date object for comparison against the filter date
               var dateParts  = cellValue.split("-");
             var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

               // Now that both parameters are Date objects, we can compare
               if (cellDate < filterLocalDateAtMidnight) {
                   return -1;
               } else if (cellDate > filterLocalDateAtMidnight) {
                   return 1;
               } else {
                   return 0;
               }
           }
       }},
       {headerName: 'Date of Security Check', field: 'dateOfSecurityCheck', filter: 'agDateColumnFilter',
       filterParams:{

           // provide comparator function
           comparator: function (filterLocalDateAtMidnight, cellValue) {

               // In the example application, dates are stored as dd/mm/yyyy
               // We create a Date object for comparison against the filter date
               var dateParts  = cellValue.split("-");
             var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

               // Now that both parameters are Date objects, we can compare
               if (cellDate < filterLocalDateAtMidnight) {
                   return -1;
               } else if (cellDate > filterLocalDateAtMidnight) {
                   return 1;
               } else {
                   return 0;
               }
           }
       }},
       {headerName: 'Date of Training', field: 'dateOfTraining', filter: 'agDateColumnFilter',
       filterParams:{

           // provide comparator function
           comparator: function (filterLocalDateAtMidnight, cellValue) {

               // In the example application, dates are stored as dd/mm/yyyy
               // We create a Date object for comparison against the filter date
               var dateParts  = cellValue.split("-");
             var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

               // Now that both parameters are Date objects, we can compare
               if (cellDate < filterLocalDateAtMidnight) {
                   return -1;
               } else if (cellDate > filterLocalDateAtMidnight) {
                   return 1;
               } else {
                   return 0;
               }
           }
       }},
       {headerName: 'Expire Date', field: 'expireDate', filter: 'agDateColumnFilter',
       filterParams:{

           // provide comparator function
           comparator: function (filterLocalDateAtMidnight, cellValue) {

               // In the example application, dates are stored as dd/mm/yyyy
               // We create a Date object for comparison against the filter date
               var dateParts  = cellValue.split("-");
             var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

               // Now that both parameters are Date objects, we can compare
               if (cellDate < filterLocalDateAtMidnight) {
                   return -1;
               } else if (cellDate > filterLocalDateAtMidnight) {
                   return 1;
               } else {
                   return 0;
               }
           }
       }},
       {headerName: 'Payment', field: 'payment'},
       {headerName: 'Returned', field: 'returned'},
       {headerName: 'Deactivated', field: 'deactivated'},
       {headerName: 'Reason for Deactivation', field: 'deactivateReason'},
       {headerName: 'Shredding Date', field: 'shreddingDate', filter: 'agDateColumnFilter',
       filterParams:{

           // provide comparator function
           comparator: function (filterLocalDateAtMidnight, cellValue) {

               // In the example application, dates are stored as dd/mm/yyyy
               // We create a Date object for comparison against the filter date
               var dateParts  = cellValue.split("-");
             var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

               // Now that both parameters are Date objects, we can compare
               if (cellDate < filterLocalDateAtMidnight) {
                   return -1;
               } else if (cellDate > filterLocalDateAtMidnight) {
                   return 1;
               } else {
                   return 0;
               }
           }
       }},
     ],
     enableCellChangeFlash: true,
     refreshCells: true,
     enableSorting: true,
     enableColResize: true,
     nRowsDisplay: 0,
     autoSizeAllColumns: true,
     onFilterChanged: function() {
       console.log('onFilterChanged: this.api.getDisplayedRowCount().toString(): ', this.api.getDisplayedRowCount().toString());
       this.context.componentParent.nRowsDisplay = this.api.getDisplayedRowCount().toString();
     },
     onGridReady: () => {
         this.loadRowData();
     }
   };

  constructor(private reportsService: ReportsService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private atndp: AsptonormaldatePipe) { }

  ngOnInit() {
    if (this.gridOptions.api) {
        this.gridOptions.api.setFilterModel(null);
    }
    this.getReps();
  }

  radioChange($event){
    // active all valid 0 1 2
    // valid active all 2 0 1
    let c;
    if($event.value == 0)
      c = 2;
    else if($event.value == 1)
      c = 0;
    else if($event.value == 2)
      c = 1;
    this.category = $event.value;
    this.getReps(c);
  }

  loadRowData() {
    this.showSpinner = false;
    this.gridOptions.api.setRowData(this.xlsx_report);
  }

  export_all_to_xlsx() {
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

    XLSX.utils.book_append_sheet(workBook, workSheet, 'BadgesReport');
    XLSX.writeFile(workBook, 'BadgesReport.xlsx');
  }

  export_to_xlsx() {
    let params = {
      columnKeys: ["badgeNumber", "employeeName", "employeeSurname", "occupation", "companyName",
        "companyNameEn", "cardSeriesNumber", "cardNumber", "payment", "returned", "deactivated",
        "deactivateReason", "shreddingDate", "dateOfActivation", "dateOfSecurityCheck", "dateOfTraining",
        "expireDate"]
    }
    this.gridOptions.api.exportDataAsCsv(params);
    this.gridOptions.enableFilter = true;
    this.gridOptions.columnApi.autoSizeAllColumns();
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [], DOA: Date, DSC: Date, DOT: Date, DE: Date, DS: Date;

    for(let i = 0; i<this.xlsx_report.length; i++){
      DOA = this.xlsx_report[i].dateOfActivation ? this.xlsx_report[i].dateOfActivation.toString() : null;
      DSC = this.xlsx_report[i].dateOfSecurityCheck ? this.xlsx_report[i].dateOfSecurityCheck.toString() : null;
      DOT = this.xlsx_report[i].dateOfTraining ? this.xlsx_report[i].dateOfTraining.toString() : null;
      DE = this.xlsx_report[i].expireDate ? this.xlsx_report[i].expireDate.toString() : null;
      DS = this.xlsx_report[i].shreddingDate ? this.xlsx_report[i].shreddingDate.toString() : null;
      tmp.push(this.xlsx_report[i].badgeNumber, this.xlsx_report[i].employeeName, this.xlsx_report[i].employeeSurname, this.xlsx_report[i].occupation,
               this.xlsx_report[i].companyName, this.xlsx_report[i].companyNameEn, this.xlsx_report[i].cardSeriesNumber,
               this.xlsx_report[i].cardNumber, DOA, DSC,
               DOT, DE, this.xlsx_report[i].payment,
               this.xlsx_report[i].returned, this.xlsx_report[i].deactivated, this.xlsx_report[i].deactivateReason, DS);
      body.push(tmp);
      tmp = [];
    }
    let docDefinition = {

    extend: 'pdfHtml5',
    orientation: 'landscape',
    pageSize: 'A1',
    alignment: 'center',

    content: [
        {
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

  getReps(c = 2) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';

    var rUrl = this.badgesReportUrl + '/' + c.toString();

    this.reportsService.getBadgesReports(rUrl)
      .subscribe((data : BadgeReport[]) => {
        this.rowCount = 'Number of rows: ' + data.length.toString();
        for(let i = 0; i<data.length; i++){
          data[i].index = i+1;
          if(data[i].expireDate) data[i].expireDate = this.atndp.transform(data[i].expireDate.toString());
          if(data[i].shreddingDate != null) data[i].shreddingDate = this.atndp.transform(data[i].shreddingDate.toString());
          if(data[i].dateOfActivation != null) data[i].dateOfActivation = this.atndp.transform(data[i].dateOfActivation.toString());
          if(data[i].dateOfSecurityCheck != null) data[i].dateOfSecurityCheck = this.atndp.transform(data[i].dateOfSecurityCheck.toString());
          if(data[i].dateOfTraining != null) data[i].dateOfTraining = this.atndp.transform(data[i].dateOfTraining.toString());
        }
        // this.gridOptions.api.setRowData(data);
        // this.gridOptions.nRowsDisplay = this.gridOptions.api.getDisplayedRowCount().toString();
        this.nRowsDisplay = data.length.toString();
        this.xlsx_report = data;
        if(this.gridOptions.api)
          this.loadRowData();
      });
  }

}
