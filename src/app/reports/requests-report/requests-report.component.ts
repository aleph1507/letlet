import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReportsService } from '../../services/reports.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { RequestReport } from '../../models/RequestReport';

@Component({
  selector: 'app-requests-report',
  templateUrl: './requests-report.component.html',
  styleUrls: ['./requests-report.component.css']
})
export class RequestsReportComponent implements OnInit {

  toDate : Date;
  fromDate : Date;

  fromString : string = null;
  toString : string = null;

  showSpinner : boolean  = true;

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
          this.reqReports = data;
          this.showSpinner = false;
        });
    }

  }

}
