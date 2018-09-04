import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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

  // displayedColumns = ['cardSeriesNumber', 'cardNumber', 'expireDate', 'active', 'returned', 'employeeId', 'employeeName', 'zones', 'dateOfSecurityCheck', 'dateOfTraining', 'dateOfActivation', 'edit'];
  displayedColumns = ['badgeNumber', 'expireDate', 'active', 'returned', 'employeeId', 'employeeName', 'zones', 'dateOfSecurityCheck', 'dateOfTraining', 'dateOfActivation', 'edit'];
  // dataSource: MatTableDataSource<Badge>(this.badgesService.getBadges());
  dataSource: MatTableDataSource<Badge>;
  length: number;
  pageSize: number;
  badges : Badge[];
  returned: boolean;

  showSpinner: boolean = true;
  // pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageEvent: PageEvent;

  constructor(private badgesService: BadgesService,
              public dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    // this.badgesService.seedBadges(1000);
    // this.badgesService.getBadges().subscribe((data : Badge[]) => {
    //   this.badges = data;
    //   this.dataSource = new MatTableDataSource<Badge>(this.badges);
    //   this.length = this.badges.length;
    // });
    // this.length = this.badgesService.getBadges().length;
    // this.pageSize = 10;
    // this.dataSource = new MatTableDataSource<Badge>(this.badgesService.getBadgesPage(this.pageEvent.pageIndex * this.pageEvent.pageSize,
                              // this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize));
    // this.dataSource = new MatTableDataSource<Badge>(this.badgesService.getBadges());
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.showSpinner = true;
    this.badgesService.getBadges(this.currentPage).subscribe((data : Badge[]) => {
      this.badges = data;
      data == null ? this.badges = [] : this.badges = data;
      this.dataSource = new MatTableDataSource<Badge>(this.badges);
      this.length = this.badges.length;
      this.dataSource.paginator = this.paginator;
      this.pageSize = 10;
      this.changeDetectorRefs.detectChanges();
      this.showSpinner = false;
    });
  }

  currentPage = 1;
  nextDisabled = false;
  prevDisabled = true;

  prevPage(page: number) {
    // console.log('vo prev page');
    if(this.currentPage > 1){
      this.currentPage--;
      this.badgesService.getBadges(this.currentPage).subscribe((data : Badge[]) => {
        // console.log('vo prev subscription data: ' + data);
          this.badges = data;
          // console.log('this.badges : ' + this.badges);
          this.dataSource = new MatTableDataSource<Badge>(this.badges);
          this.nextDisabled = false;
      });
    }
  }

  nextPage(page: number) {
    // console.log('vo next page');
    this.badgesService.getBadges(this.currentPage+1).subscribe((data : Badge[]) => {
      // console.log('vo next subscription data: ' + data);
      if(data){
        this.currentPage++;
        this.badges = data;
        // console.log('this.badges : ' + this.badges);
        this.dataSource = new MatTableDataSource<Badge>(this.badges);
      } else {
        this.nextDisabled = true;
      }
    });
  }

  editBadge(id: number = null){
    // let b = this.badgesService;
    // let v = this.resources.vehicles.getVehicleByIndex(index);
    // let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
    //   width: '45vw',
    //   data: {vehicle: v, i: index, resource: false}
    // });
    //
    // console.log('posle edit vehicles: ', this.requesterService.getAllVehicles());
  }

  // getPage(e: any){
  //   this.currentPage = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.iterator();
  // }
  //
  // private iterator() {
  //   const end = (this.currentPage + 1) * this.pageSize;
  //   const start = this.currentPage * this.pageSize;
  //   const part = this.badges.slice(start, end);
  //   this.dataSource.data = part;
  // }

  getZoneIDs(zones){
    let IDs = [];
    for(let i = 0; i<zones.length; i++){
      IDs.push(zones[i].id);
    }
    return IDs;
  }

  getZoneCodes(zones){
    // console.log('zones: ', zones);
    let codes = [];
    for(let i = 0; i<zones.length; i++){
      // codes.push(zones[i].zone.code);
      codes.push(zones[i].zone.name)
    }
    return codes;
  }

  openDialog(id = null): void {
    let dialogRef;
    if(id != null){
      this.badgesService.getBadgeById(id)
        .subscribe((res: Badge) => {
          dialogRef = this.dialog.open(BadgesCreateComponent, {
            width: '70%',
            data: res
          }).afterClosed().subscribe(result => {this.refresh()});
        })
    } else {
        dialogRef = this.dialog.open(BadgesCreateComponent, {
        width: '70%',
        data: null
        // data: { name: this.name, animal: this.animal }
      }).afterClosed().subscribe(result => {this.refresh()});
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
