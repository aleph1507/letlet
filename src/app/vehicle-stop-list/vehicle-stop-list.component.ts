import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { VslService } from '../services/vsl.service';
import { VehicleStopListEntry } from '../models/VehicleStopListEntry';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { AsptonormaldatePipe } from '../shared/pipes/asptonormaldate.pipe';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vehicle-stop-list',
  templateUrl: './vehicle-stop-list.component.html',
  styleUrls: ['./vehicle-stop-list.component.css']
})
export class VehicleStopListComponent implements OnInit {

  xlsx_report;

  columns = ['Index', 'Permit Number', 'Vehicle Model', 'Vehicle Plate', 'Vehicle Company', 'Expire Date', 'Reason'];

  public gridOptions: GridOptions = <GridOptions>{
    floatingFilter: true,
    rowData: [],
    columnDefs: [
      {headerName: 'Index', field: 'index'},
      {headerName: 'Permit Number', field: 'permitNumber'},
      {headerName: 'Vehicle Model', field: 'model'},
      {headerName: 'Vehicle Plate', field: 'plate'},
      {headerName: 'Vehicle Company', field: 'companyName'},
      {headerName: 'Expire Date', field: 'expireDate'},
      {headerName: 'Reason', field: 'deactivateReason'}
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
  };

  numRows: Number = 0;
  rowCount: string = '';

  constructor(private vslService: VslService) { }

  ngOnInit() {
    this.vslService.getVehicleStopListEntries()
      .subscribe((data: VehicleStopListEntry[]) => {
        this.xlsx_report = data;
        this.numRows = data.length;
        this.rowCount = 'Number of rows: ' + this.numRows;
        let atndPipe = new AsptonormaldatePipe();
        for(let i = 0; i<this.xlsx_report.length; i++){
          this.xlsx_report[i].index = i+1;
          this.xlsx_report[i].expireDate = atndPipe.transform(this.xlsx_report[i].expireDate);
        }
        this.gridOptions.api.setRowData(data);
      });
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

    XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesStopList');
    XLSX.writeFile(workBook, 'VehiclesStopList.xlsx');
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [];
    for(let i = 0; i<this.xlsx_report.length; i++){
      tmp.push(this.xlsx_report[i].index, this.xlsx_report[i].permitNumber, this.xlsx_report[i].model, this.xlsx_report[i].plate,
              this.xlsx_report[i].companyName, this.xlsx_report[i].expireDate, this.xlsx_report[i].reason);
      body.push(tmp);
      tmp = [];
    }
    let docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 100, '*', '*', '*'],

            body: body
          }
        }
      ]
    }
   pdfMake.createPdf(docDefinition).download('VehicleStopList.pdf');
  }

}
