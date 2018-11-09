import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReportsService } from '../../services/reports.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { RequestReport } from '../../models/RequestReport';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrls: ['./requests-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RequestsReportComponent implements OnInit {

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  showSpinner : boolean  = true;

  displayTable : boolean;

  reqReports : RequestReport[];

  requestsReportUrl = this.authService.baseUrl + '/api/Requests/requestsReport/';

  constructor(private authService: AuthService,
              private reportsService: ReportsService) { }

  ngOnInit() {
    this.toDate = new Date();
    this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getReps();
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

      date.getDate() >= 10 ?
        day = '-' + (date.getDate()).toString() : day = '-0' + (date.getDate()).toString();

      picker == 'from' ? this.fromString = date.getFullYear() + month + day :
                        this.toString = date.getFullYear() + month + day;

    }


    var rUrl = this.requestsReportUrl + '/' + this.fromString + '/' + this.toString;

    if(this.fromString != null && this.toString != null){
      this.reportsService.getRequestsReports(rUrl)
        .subscribe((data: RequestReport[]) => {
          console.log(data);
          for(let i = 0; i<data.length; i++){
            data[i].fromDate = data[i].fromDate.toString().split('T')[0].replace(/-/gi, '/');
            data[i].toDate = data[i].toDate.toString().split('T')[0].replace(/-/gi, '/');
            let tmpd = data[i].fromDate.split('/');
            data[i].fromDate = tmpd[2] + '/' + tmpd[1] + '/' + tmpd[0];
            tmpd = data[i].toDate.split('/');
            data[i].toDate = tmpd[2] + '/' + tmpd[1] + '/' + tmpd[0];
          }
          this.reqReports = data;
          this.showSpinner = false;
        });
    }

  }

  printRequestReport() {
    let printContents, popupWin;
    let tableDiv = document.getElementById('tableDiv').innerHTML;
    console.log('tableDiv: ', tableDiv);
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <style>
            .reportDiv {
              width: 100%;
            }

            .rReportTable {
              background: white;
              border-collapse: collapse;
               width: 100%;
            }

            .rReportTable td{
              padding:6px;
              border-bottom:1px solid black;
              width: 6%;
              text-align:center;
              vertical-align: top;
            }

            .rReportTable td.list{
              text-align:justify;
            }

            .reqHead {
            background-color: #c4c7ce;
            }

            th {
              border-bottom: 1px solid grey;
              margin-top: 1vh;
              margin-bottom: 0.5vh;
              padding-bottom: 0.5vh;
              text-align:center;
            }

            .header {
              display:flex;
              align-items: space-between;
              justify-content:space-between;
            }

            li {
              list-style: decimal;
              list-style-position: inside;
            }

            @media print {
              tr {
                page-break-inside: auto;
              }

              td.list, tr.listTr, ul {
                page-break-inside: auto;
                page-break-after: always;
                page-break-before: auto;
              }

              ul li {
                page-break-inside: auto;
                page-break-after: auto;
                page-break-before: auto;
              }
            }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div class="header">
              <div class="lh">
                <h2 style='color:lightblue;'>SKOPJE Airport</h2>
                <h2 style='color:blue;'>Expected persons report:</h2>
                <h4>Period: ${this.fromDate.getDate()}/${this.fromDate.getMonth()}/${this.fromDate.getFullYear()} - ${this.toDate.getDate()}/${this.toDate.getMonth()}/${this.toDate.getFullYear()}</h4>
              </div>
              <div class="rh">
                ${this.logo}
              </div>
            </div>
            <div id="tableDiv">
              ${tableDiv}
            </div>
          </body>
        </html>
      `);

    popupWin.document.close();
  }

  logo = `<img
                src="data:image/png;base64,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"
                class="logo grey-border">
`;

}
