import { Component, OnInit, ViewChild } from '@angular/core';
import { BadgesService } from '../services/badges.service';
import { Badge } from '../models/Badge.model';
import { FormGroup } from '@angular/forms';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource, MatDialog} from '@angular/material';
import { BadgesCreateComponent } from './badges-create/badges-create.component';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css']
})
export class BadgesComponent implements OnInit {

  displayedColumns = ['company', 'personName', 'validTo', 'zones', 'dateSecCheck', 'dateTraining', 'id'];
  // dataSource: MatTableDataSource<Badge>(this.badgesService.getBadges());
  dataSource: MatTableDataSource<Badge>;
  length: number;
  pageSize: number;
  // pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageEvent: PageEvent;

  constructor(private badgesService: BadgesService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.badgesService.seedBadges(1000);
    this.length = this.badgesService.getBadges().length;
    this.pageSize = 10;
    // this.dataSource = new MatTableDataSource<Badge>(this.badgesService.getBadgesPage(this.pageEvent.pageIndex * this.pageEvent.pageSize,
                              // this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize));
    this.dataSource = new MatTableDataSource<Badge>(this.badgesService.getBadges());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(BadgesCreateComponent, {
      width: '40%',
      // data: { name: this.name, animal: this.animal }
    });
  }
  // changePage(event) {
  //   this.pageEvent = event;
  //   this.dataSource = this.badgesService.getBadgesPage(this.pageEvent.pageIndex * this.pageEvent.pageSize,
  //                             this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize);
  // }

  // editCellRenderer(params) {
  //   return params;
  // }
  //
  // columnDefs = [
  //   {headerName: 'Company', field: 'company'},
  //   {headerName: 'Person Name', field: 'personName'},
  //   {headerName: 'Valid To', field:'validTo', valueFormatter: function(data) {
  //       return moment(data.value).format('L');
  //   }},
  //   {headerName: 'Zones', field: 'zones'},
  //   {headerName: 'Date Security Check', field: "dateSecCheck", valueFormatter: function(data) {
  //       return moment(data.value).format('L');
  //   }},
  //   {headerName: 'Date Training', field: "dateTraining", valueFormatter: function(data) {
  //       return moment(data.value).format('L');
  //   }},
  //   {headerName: 'Edit', field: "id", cellRenderer: function(data) {
  //     return '<a [routerLink]=\"[\'/badges/edit\'' + data.value + ']\">'  +
  //             "<mat-icon>mode_edit<mat-icon></a>";
  //   }}
  // ];
  //
  // rowData = [];

  // ngOnInit() {
    // this.badgesService.seedBadges();
    // this.rowData = this.badgesService.getBadges();
  // }

}
