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
      {headerName: 'Index', valueGetter: (args) => args.node.rowIndex + 1, rowDrag: true},
      {headerName: 'Permit Number', field: 'permitNumber'},
      {headerName: 'Vehicle Model', field: 'model'},
      {headerName: 'Vehicle Plate', field: 'plate'},
      {headerName: 'Vehicle Company', field: 'companyName'},
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
        this.gridOptions.nRowsDisplay = this.gridOptions.api.getDisplayedRowCount().toString();
      });
  }

  export_to_xlsx() {
    let params = {
      columnKeys: ["permitNumber", "model", "plate", "companyName", "expireDate", "deactivateReason", "deactivateReason"]
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
    // XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesStopList');
    // XLSX.writeFile(workBook, 'VehiclesStopList.xlsx');
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
