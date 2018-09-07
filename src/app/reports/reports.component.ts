import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
