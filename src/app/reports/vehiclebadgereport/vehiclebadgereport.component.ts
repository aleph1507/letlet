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
  categories = ['Active', 'All'];

  rowCount = '';

  vehicleBadgesReportUrl = this.authService.baseUrl + '/api/badges/vehiclebadgereport';

  xlsx_report = null;

  columns = ['Permit Number', 'Expire Date', 'Payment', 'Returned', 'Deactivated', 'Reason for Deactivation',
     'Shredding Date', 'Vehicle Model', 'Vehicle Plate', 'Company Name',
     'Company Name in English'];

   public gridOptions: GridOptions = <GridOptions>{
     rowData: [],
     columnDefs: [
       {headerName: 'Index', field: 'index'},
       {headerName: 'Permit Number', field: 'permitNumber'},
       {headerName: 'Expire Date', field: 'expireDate'},
       {headerName: 'Payment', field: 'payment'},
       {headerName: 'Returned', field: 'returned'},
       {headerName: 'Deactivated', field: 'deactivated'},
       {headerName: 'Reason for Deactivation', field: 'deactivateReason'},
       {headerName: 'Shredding Date', field: 'shreddingDate'},
       {headerName: 'Vehicle Model', field: 'vehicleModel'},
       {headerName: 'Vehicle Plate', field: 'vehiclePlate'},
       {headerName: 'Company Name', field: 'companyName'},
       {headerName: 'Company Name in English', field: 'companyNameEn'},
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
              private route: ActivatedRoute,
              private atndp: AsptonormaldatePipe,
              private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.gridOptions.api) {
        this.gridOptions.api.setFilterModel(null);
    }
    //
    // this.route.queryParamMap.subscribe(params => {
    //   console.log("params.filter: ", params.get('filter'));
    //   if(params.get('filter') == 's'){
    //     // setTimeout(() => {
    //       this.snackbarService.successSnackBar("Успешно!");
    //     // });
    //   }
    // });

    // this.gridOptions.
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

    XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesBadgesReport');
    XLSX.writeFile(workBook, 'VehiclesBadgesReport.xlsx');
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
    // orientation: 'landscape',//landscape give you more space
    pageSize: 'A3',//A0 is the largest A5 smallest(A0,A1,A2,A3,legal,A4,A5,letter))
    alignment: 'center',

    content: [
        {
          // alignment: 'center',
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

  getReps(c = 0) {
    this.showSpinner = true;
    var month : string = '';
    var day : string = '';


    var rUrl = this.vehicleBadgesReportUrl + '/' + c.toString();

    this.reportsService.getVehicleBadgesReports(rUrl)
      .subscribe((data : VehicleBadgeReport[]) => {
        console.log('vo subscribtion, data: ', data);
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
