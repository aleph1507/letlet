import { Component, OnInit, ViewChild } from '@angular/core';
import { StopListService } from '../services/stop-list.service';
import { StopListEntry } from '../models/StopListEntry.model';
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
  xlsx_report;
  columns = ['Index', 'Employee Name', 'Company Name', 'Card Series Number', 'Card Number', 'Badge number', 'Expire Date'];
  numRows: Number = 0;
  nRowsDisplay: string = '';

  public gridOptions: GridOptions = <GridOptions>{
    floatingFilter: true,
    rowData: [],
    columnDefs: [
      {headerName: 'Index', valueGetter: (args) => args.node.rowIndex + 1, rowDrag: true},
      {headerName: 'Employee Name', field: 'employeeName'},
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Badge Number', field: 'badgeNumber', filter: 'agNumberColumnFilter'},
      {headerName: 'Card Number', field: 'cardNumber', filter: 'agNumberColumnFilter'},
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
      {headerName: 'Reason', field: 'deactivateReason'}
    ],
    enableColResize: true,
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
    nRowsDisplay: 0,
    autoSizeAllColumns: true,
    onFilterChanged: function() {
      this.nRowsDisplay = this.api.getDisplayedRowCount().toString();
    }
  };



  export_to_xlsx() {
    let params = {
      columnKeys: ["employeeName", "companyName", "badgeNumber", "cardNumber", "expireDate", "deactivateReason"]
    }
    this.gridOptions.api.exportDataAsCsv(params);
    this.gridOptions.enableFilter = true;
    this.gridOptions.columnApi.autoSizeAllColumns();
    // let tmpX = this.xlsx_report;
    // for(let i = 0; i<tmpX.length; i++){
    //   delete tmpX[i].index;
    // }
    // const workBook = XLSX.utils.book_new();
    // const workSheet = XLSX.utils.json_to_sheet(tmpX);
    //
    // let wscols = [];
    //
    // for(let i = 0; i<10; i++)
    //   wscols.push({wch: 20});
    //
    // workSheet['!cols'] = wscols;
    //
    // XLSX.utils.book_append_sheet(workBook, workSheet, 'StopList');
    // XLSX.writeFile(workBook, 'StopList.xlsx');
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [];
    for(let i = 0; i<this.xlsx_report.length; i++){
      tmp.push(this.xlsx_report[i].index, this.xlsx_report[i].employeeName, this.xlsx_report[i].companyName, this.xlsx_report[i].cardSeriesNumber,
              this.xlsx_report[i].cardNumber, this.xlsx_report[i].badgeNumber, this.xlsx_report[i].expireDate);
      body.push(tmp);
      tmp = [];
    }
    let docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: body
          }
        }
      ]
    }
   pdfMake.createPdf(docDefinition).download('StopList.pdf');
  }

  constructor(private slService: StopListService) { }

  ngOnInit() {
    this.slService.getStopListEntries()
      .subscribe((data : StopListEntry[]) => {
        this.numRows = data.length;
        this.nRowsDisplay = 'Number of rows: ' + this.numRows;
        this.xlsx_report = data;
        let atndPipe = new AsptonormaldatePipe();
        for(let i = 0; i<this.xlsx_report.length; i++){
          this.xlsx_report[i].index = i+1;
          this.xlsx_report[i].expireDate = atndPipe.transform(this.xlsx_report[i].expireDate);
        }
        // for(let i = 0; i<data.length; i++)
        //   data[i].expireDate = new Date(data[i].expireDate);
        // for(let i = 0 ;i<data.length; i++){
        //   // console.log(`data[i]: `, data[i]);
        //   Object.keys(data).forEach(function(d){
        //     console.log(d, ' - ', data[d]);
        //   });
        // }

        this.gridOptions.api.setRowData(data);
        this.gridOptions.nRowsDisplay = this.gridOptions.api.getDisplayedRowCount().toString();
        console.log('this.nRowsDisplay: ', this.nRowsDisplay);
      });
  }
}
