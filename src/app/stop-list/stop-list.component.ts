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

  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Index', field: 'index'},
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

  numRows: Number = 0;
  nRowsDisplay: string = '';

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

    XLSX.utils.book_append_sheet(workBook, workSheet, 'StopList');
    XLSX.writeFile(workBook, 'StopList.xlsx');
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
        this.gridOptions.api.setRowData(data);
      });
  }
}
