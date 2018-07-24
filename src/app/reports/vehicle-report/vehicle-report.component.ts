import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ReportsService } from '../../services/reports.service';
import { VehicleReport } from '../../models/VehicleReport.model';
import { AuthService } from '../../services/auth.service';
import { MatDatepickerInputEvent } from '@angular/material';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.css']
})
export class VehicleReportComponent implements OnInit {

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  personsReport : VehicleReport[];

  personsReportUrl = this.authService.baseUrl + '/api/visits/vehiclereport';
  gotRowData: boolean = false;

  xlsx_report;

  columns = ['Company Name', 'Vehicle Model', 'Vehicle Plate', 'Entered Through Gate',
     'Entry Approved By', 'Entry Escorted By', 'Exited Through Gate', 'Exit Approved By',
     'Exit Escorted By', 'Days On Air Side', 'Time On Air Side'];

  public gridOptions: GridOptions = <GridOptions>{
    rowData: [],
    columnDefs: [
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Vehicle Model', field: 'vehicleModel'},
      {headerName: 'Vehicle Plate', field: 'plateNumber'},
      {headerName: 'Entered Through Gate', field: 'enteredOnGate'},
      {headerName: 'Entry Approved By', field: 'approvedEnterFrom'},
      {headerName: 'Entry Escorted By', field: 'entryEscortedBy'},
      {headerName: 'Exited Through Gate', field: 'exitedOnGate'},
      {headerName: 'Exit Approved By', field: 'approvedExitFrom'},
      {headerName: 'Exit Escorted By', field: 'exitEscortedBy'},
      {headerName: 'Days On Air Side', field: 'numberOfDays'},
      {headerName: 'Time On Air Side', field: 'timeOnAirSide'}
    ],
    enableCellChangeFlash: true,
    refreshCells: true,
    enableFilter: true,
    enableSorting: true,
  };

  constructor(private reportsService: ReportsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getReps();
  }

  export_to_xlsx() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.xlsx_report);

    let wscols = [];

    for(let i = 0; i<10; i++)
      wscols.push({wch: 20});

    workSheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'VehiclesReport');
    XLSX.writeFile(workBook, 'VehiclesReport.xlsx');
  }

  export_to_pdf() {
    let body = [];
    body.push(this.columns);
    let tmp = [];
    for(let i = 0; i<this.xlsx_report.length; i++){
      tmp.push(this.xlsx_report[i].companyName, this.xlsx_report[i].vehicleModel, this.xlsx_report[i].plateNumber,
               this.xlsx_report[i].enteredOnGate, this.xlsx_report[i].approvedEnterFrom,
               this.xlsx_report[i].entryEscortedBy, this.xlsx_report[i].exitedOnGate,
               this.xlsx_report[i].approvedExitFrom, this.xlsx_report[i].exitEscortedBy,
               this.xlsx_report[i].numberOfDays, this.xlsx_report[i].timeOnAirSide);
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
   pdfMake.createPdf(docDefinition).download('VehiclesReport.pdf');
  }

  getReps(picker = null, event: MatDatepickerInputEvent<Date> = null) {
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


    var rUrl = this.personsReportUrl + '/' + this.fromString + '/' + this.toString;

    if(this.fromString != null && this.toString != null){
      this.reportsService.getVehicleReports(rUrl)
        .subscribe((data : VehicleReport[]) => {
          for(let i = 0; i<data.length; i++){
            data[i].timeOnAirSide = data[i].timeOnAirSide.split('.')[0];
          }
          this.xlsx_report = data;
          this.gridOptions.api.setRowData(data);
        });
    }

  }

}
