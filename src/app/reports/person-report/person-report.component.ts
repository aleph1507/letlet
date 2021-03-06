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

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  personsReport : PersonReport[];

  rowCount = '';

  personsReportUrl = this.authService.baseUrl + '/api/visits/personreport';
  gotRowData: boolean = false;

  showSpinner: boolean = true;

  xlsx_report;

  columns = ['Entry Date and Time', 'Exit Date and Time', 'Company Name', 'Person', 'Entered Through Gate', 'Entry Approved By',
     'Entry Escorted By', 'Exited Through Gate', 'Exit Approved By', 'Exit Escorted By', 'Bill Number', 'Reason',
     'Days On Air Side', 'Time On Air Side'];


  public gridOptions: GridOptions = <GridOptions>{
    context: {
      componentParent: this
    },
    enableFilter: true,
    floatingFilter: true,
    rowData: [],
    columnDefs: [
      {headerName: 'Index', valueGetter: (args) => args.node.rowIndex + 1},
      {headerName: 'Entry At', field: 'entryDateTime', filter: 'agDateColumnFilter',
      filterParams:{

          // provide comparator function
          comparator: function (filterLocalDateAtMidnight, cellValue) {

              // In the example application, dates are stored as dd/mm/yyyy
              // We create a Date object for comparison against the filter date
              var tmp = cellValue.split(' ');
              var dateParts  = tmp[0].split("/");
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
      },
      valueFormatter: function(data) {
        if(data.value == '')
          return data.value;
        let second = data.value.split(' ')[1];
        let saat = second.split(':')[0];
        let minuti = second.split(':')[1];
        if(parseInt(saat) < 10)
          saat = '0' + saat.toString();
        if(parseInt(minuti) < 10)
          minuti = '0' + minuti.toString();

        return data.value.split(' ')[0] + ' ' + saat + ':' + minuti;
      }},
      {headerName: 'Exit At', field: 'exitDateTime', filter: 'agDateColumnFilter',
      filterParams:{

          // provide comparator function
          comparator: function (filterLocalDateAtMidnight, cellValue) {

              // In the example application, dates are stored as dd/mm/yyyy
              // We create a Date object for comparison against the filter date
              var tmp = cellValue.split(' ');
              var dateParts  = tmp[0].split("/");
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
      },
      valueFormatter: function(data) {
        if(data.value == '')
          return data.value;
        let second = data.value.split(' ')[1];
        let saat = second.split(':')[0];
        let minuti = second.split(':')[1];
        if(parseInt(saat) < 10)
          saat = '0' + saat.toString();
        if(parseInt(minuti) < 10)
          minuti = '0' + minuti.toString();

        return data.value.split(' ')[0] + ' ' + saat + ':' + minuti;
      }},
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Person', field: 'personVisited'},
      {headerName: 'Visitor Badge', field: 'visitorBadge'},
      {headerName: 'Entered Through Gate', field: 'enteredOnGate'},
      {headerName: 'Entry Approved By', field: 'approvedEnterFrom'},
      {headerName: 'Entry Escorted By', field: 'entryEscortedBy'},
      {headerName: 'Exited Through Gate', field: 'exitedOnGate'},
      {headerName: 'Exit Approved By', field: 'approvedExitFrom'},
      {headerName: 'Exit Escorted By', field: 'exitEscortedBy'},
      {headerName: 'Bill Number', field: 'billNumber'},
      {headerName: 'Reason', field: 'reason'},
      {headerName: 'Days On Air Side', field: 'numberOfDays'},
      {headerName: 'Time On Air Side', field: 'timeOnAirSide'}
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableSorting: true,
    enableColResize: true,
    nRowsDisplay: 0,
    autoSizeAllColumns: true,
    onFilterChanged: function() {
      this.context.componentParent.rowCount = 'Number of rows: ' + this.api.getDisplayedRowCount().toString();
    }
  };

  constructor(private reportsService: ReportsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getReps();
  }

  export_all_to_xlsx() {
        let tmpX = this.xlsx_report;
        for(let i = 0; i<tmpX.length; i++){
          delete tmpX[i].index;
        }
        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(tmpX);
        let wscols = [];

        for(let i = 0; i<10; i++) wscols.push({wch: 20});

        workSheet['!cols'] = wscols;

        XLSX.utils.book_append_sheet(workBook, workSheet, 'PersonsReport');
        XLSX.writeFile(workBook, 'PersonsReport.xlsx');
  }

  export_to_xlsx() {
    let tmpX = [];
    this.gridOptions.api.forEachNodeAfterFilterAndSort(function (rowNode) {
      tmpX.push(Object.assign({}, rowNode.data));
    });

    for(let i = 0; i<tmpX.length; i++){
      delete tmpX[i].index;
    }
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(tmpX);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'PersonsReport');
    XLSX.writeFile(workBook, 'PersonssReport.xlsx');
    // let params = {
    //   columnKeys: ["entryDateTime", "exitDateTime", "companyName", "personVisited", "enteredOnGate",
    //     "approvedEnterFrom", "entryEscortedBy", "exitedOnGate", "approvedExitFrom", "exitEscortedBy", "numberOfDays",
    //     "timeOnAirSide"]
    // }
    // this.gridOptions.api.exportDataAsCsv(params);
    // this.gridOptions.enableFilter = true;
    // this.gridOptions.columnApi.autoSizeAllColumns();
  }

     export_to_pdf() {
       let body = [];
       body.push(this.columns);
       let tmp = [];
       for(let i = 0; i<this.xlsx_report.length; i++){
         tmp.push(this.xlsx_report[i].entryDateTime, this.xlsx_report[i].exitDateTime, this.xlsx_report[i].companyName, this.xlsx_report[i].personVisited,
                  this.xlsx_report[i].enteredOnGate, this.xlsx_report[i].approvedEnterFrom,
                  this.xlsx_report[i].entryEscortedBy, this.xlsx_report[i].exitedOnGate,
                  this.xlsx_report[i].approvedExitFrom, this.xlsx_report[i].exitEscortedBy,
                  this.xlsx_report[i].billNumber, this.xlsx_report[i].reason,
                  this.xlsx_report[i].numberOfDays, this.xlsx_report[i].timeOnAirSide);
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
               widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
               body: body
             }
           }
         ]
       }
      pdfMake.createPdf(docDefinition).download('PersonsReport.pdf');
     }

  getReps(picker = null, event: MatDatepickerInputEvent<Date> = null) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';

    if(event == null) {
      this.fromDate.getMonth() >= 9 ?
        month = '-' + (this.fromDate.getMonth() + 1).toString() : month = '-0' + (this.fromDate.getMonth()+1).toString();

      this.fromDate.getDate() >= 10 ?
        day = '-' + (this.fromDate.getDate()).toString() : day = '-0' + (this.fromDate.getDate()).toString();

      this.fromString = this.fromDate.getFullYear() + month + day;

      this.toDate.getMonth() >= 9 ?
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
      date.getMonth() >= 9 ?
        month = '-' + (date.getMonth() + 1).toString() : month = '-0' + (date.getMonth() + 1).toString();

      date.getDate() >= 9 ?
        day = '-' + (date.getDate()).toString() : day = '-0' + (date.getDate()).toString();

      picker == 'from' ? this.fromString = date.getFullYear() + month + day :
                        this.toString = date.getFullYear() + month + day;

    }


    var rUrl = this.personsReportUrl + '/' + this.fromString + '/' + this.toString;

    if(this.fromString != null && this.toString != null){
      this.reportsService.getReports(rUrl)
        .subscribe((data : PersonReport[]) => {
            this.rowCount = 'Number of rows: ' + data.length.toString();
            for(let i = 0; i<data.length; i++){
              data[i].index = i+1;
              data[i].timeOnAirSide = data[i].timeOnAirSide.split('.')[0];
            }

            this.xlsx_report = data;
            this.gridOptions.api.setRowData(data);
            this.rowCount = 'Number of rows: ' + data.length.toString();
            this.showSpinner = false;
        });
    }

  }

}
