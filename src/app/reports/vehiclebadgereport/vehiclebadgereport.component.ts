import { Component, OnInit } from '@angular/core';
import { VehicleBadgeReport } from '../../models/VehicleBadgeReport';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ActivatedRoute } from '@angular/router';
import { AsptonormaldatePipe } from '../../shared/pipes/asptonormaldate.pipe';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vehiclebadgereport',
  templateUrl: './vehiclebadgereport.component.html',
  styleUrls: ['./vehiclebadgereport.component.css']
})
export class VehiclebadgereportComponent implements OnInit {

  vehicleBadgeReports : VehicleBadgeReport[];

  showSpinner : boolean = true;

  category: number = 0;
  categories = ['Active and Valid', 'Active', 'All', ];

  rowCount = '';

  that = this;
  vehicleBadgesReportUrl = this.authService.baseUrl + '/api/badges/vehiclebadgereport';

  xlsx_report = null;

  columns = ['Permit Number', 'Expire Date', 'Payment', 'Returned', 'Deactivated', 'Reason for Deactivation',
     'Shredding Date', 'Vehicle Model', 'Vehicle Plate', 'Company Name',
     'Company Name in English'];

   public gridOptions: GridOptions = <GridOptions>{
     context: {
       componentParent: this
     },
     floatingFilter: true,
     rowData: [],
     columnDefs: [
       {headerName: 'Index', valueGetter: (args) => args.node.rowIndex + 1},
       {headerName: 'Permit Number', field: 'permitNumber'},
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
       {headerName: 'Vehicle Model', field: 'vehicleModel'},
       {headerName: 'Vehicle Plate', field: 'vehiclePlate'},
       {headerName: 'Company Name', field: 'companyName'},
       {headerName: 'Company Name in English', field: 'companyNameEn'},
     ],
     enableCellChangeFlash: true,
     refreshCells: true,
     enableSorting: true,
     enableColResize: true,
     nRowsDisplay: 0,
     autoSizeAllColumns: true,
     onFilterChanged: function() {
       this.context.componentParent.rowCount = 'Number of rows: ' + this.api.getDisplayedRowCount().toString();
     },
     onGridReady: () => {
         this.loadRowData();
     },
   };

  constructor(private reportsService: ReportsService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private atndp: AsptonormaldatePipe,
              private datePipe: DatePipe) { }

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
    // this.gridOptions.api.context = { this: this};
  }

  usDateStringToISODateString(dateString) {
    var resultChunks = dateString.split("-");
    return resultChunks[2] + "-" + resultChunks[1] + "-" + resultChunks[0];
  }

  export_all_to_xlsx() {
    let tmpX = this.xlsx_report.map(x => Object.assign({}, x));
    for(let i = 0; i<tmpX.length; i++){
      delete tmpX[i].index;
      tmpX[i].expireDate = tmpX[i].expireDate && tmpX[i].expireDate !== "" ? new Date(this.usDateStringToISODateString(tmpX[i].expireDate)) : null;
      tmpX[i].shreddingDate = tmpX[i].shreddingDate && tmpX[i].shreddingDate !== "" ? new Date(this.usDateStringToISODateString(tmpX[i].shreddingDate)) : null;
    }
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(tmpX);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesBadgesReport');
    XLSX.writeFile(workBook, 'VehiclesBadgesReport.xlsx');
  }

  export_to_xlsx() {
    let tmpX = [];
    this.gridOptions.api.forEachNodeAfterFilterAndSort(function (rowNode) {
      tmpX.push(Object.assign({}, rowNode.data));
    });

    for(let i = 0; i<tmpX.length; i++){
      delete tmpX[i].index;
      tmpX[i].expireDate = tmpX[i].expireDate && tmpX[i].expireDate !== "" ? new Date(this.usDateStringToISODateString(tmpX[i].expireDate)) : null;
      tmpX[i].shreddingDate = tmpX[i].shreddingDate && tmpX[i].shreddingDate !== "" ? new Date(this.usDateStringToISODateString(tmpX[i].shreddingDate)) : null;
    }
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(tmpX);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesBadgesReport');
    XLSX.writeFile(workBook, 'VehiclesBadgesReport.xlsx');
    // let params = {
    //   columnKeys: ["permitNumber", "expireDate", "payment", "returned", "deactivated",
    //     "deactivateReason", "shreddingDate", "vehicleModel", "vehiclePlate", "companyName", "companyNameEn"]
    // }
    // this.gridOptions.api.exportDataAsCsv(params);
    // this.gridOptions.enableFilter = true;
    // this.gridOptions.columnApi.autoSizeAllColumns();
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [], DOA:Date, DSC:Date, DOT:Date, DE:Date, DS:Date;
    for(let i = 0; i<this.xlsx_report.length; i++){
      DE = this.xlsx_report[i].expireDate ? this.xlsx_report[i].expireDate.toString() : null;
      DS = this.xlsx_report[i].shreddingDate ? this.xlsx_report[i].shreddingDate.toString() : null;

      tmp.push(this.xlsx_report[i].permitNumber, DE, this.xlsx_report[i].payment, this.xlsx_report[i].returned, this.xlsx_report[i].deactivated,
               this.xlsx_report[i].deactivateReason, DS,
               this.xlsx_report[i].vehicleModel, this.xlsx_report[i].vehiclePlate,
               this.xlsx_report[i].companyName, this.xlsx_report[i].companyNameEn);
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
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: body
          }
        }
      ]
    }
   pdfMake.createPdf(docDefinition).download('VehiclesBadgesReport.pdf');
  }

  getReps(c = 2) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';


    var rUrl = this.vehicleBadgesReportUrl + '/' + c.toString();

    this.reportsService.getVehicleBadgesReports(rUrl)
      .subscribe((data : VehicleBadgeReport[]) => {
        for(let i = 0; i<data.length; i++) {
          data[i].index = i+1;
          this.rowCount = 'Number of rows: ' + data.length.toString();
          if(data[i].expireDate) data[i].expireDate = this.atndp.transform(data[i].expireDate.toString());
          if(data[i].shreddingDate != null) data[i].shreddingDate = this.atndp.transform(data[i].shreddingDate.toString());
        }
        this.xlsx_report = data;
        if(this.gridOptions.api)
          this.loadRowData();
      });
  }

}
