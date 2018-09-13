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

  displayedColumns = ['badgeNumber', 'expireDate', 'active', 'returned', 'employeeId', 'employeeName', 'zones', 'dateOfSecurityCheck', 'dateOfTraining', 'dateOfActivation', 'edit'];
  dataSource: MatTableDataSource<Badge>;
  length: number;
  pageSize: number;
  badges : Badge[];
  returned: boolean;

  showSpinner: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageEvent: PageEvent;

  constructor(private badgesService: BadgesService,
              public dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.showSpinner = true;
    this.badgesService.getBadges(this.currentPage).subscribe((data : Badge[]) => {
      this.badges = data;
      for(let i = 0; i<this.badges.length; i++){
        console.log('this.badges[i].expireDate: ', this.badges[i].expireDate);
        console.log('expireDate: ', this.expired(this.badges[i].expireDate));
      }
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
    if(this.currentPage > 1){
      this.currentPage--;
      this.badgesService.getBadges(this.currentPage).subscribe((data : Badge[]) => {
          this.badges = data;
          this.dataSource = new MatTableDataSource<Badge>(this.badges);
          this.nextDisabled = false;
      });
    }
  }

  nextPage(page: number) {
    this.badgesService.getBadges(this.currentPage+1).subscribe((data : Badge[]) => {
      if(data){
        this.currentPage++;
        this.badges = data;
        this.dataSource = new MatTableDataSource<Badge>(this.badges);
      } else {
        this.nextDisabled = true;
      }
    });
  }

  getZoneIDs(zones){
    let IDs = [];
    for(let i = 0; i<zones.length; i++){
      IDs.push(zones[i].id);
    }
    return IDs;
  }

  getZoneCodes(zones){
    let codes = [];
    for(let i = 0; i<zones.length; i++){
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
      }).afterClosed().subscribe(result => {this.refresh()});
    }
  }

  applyFilter(filterValue: string) {
    this.showSpinner = true;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.badgesService.filterBadges(filterValue)
      .subscribe((data: Badge[]) => {
        if(data){
          if(filterValue != ''){
            this.badges = data;
            this.dataSource = new MatTableDataSource<Badge>(this.badges);
          } else {
            this.badgesService.getBadges(1)
              .subscribe((data: Badge[]) => {
                this.badges = data;
                this.dataSource = new MatTableDataSource<Badge>(this.badges);
              });
          }
        }
        this.showSpinner = false;
      });

      this.dataSource.filter = filterValue;
      this.showSpinner = false;
  }

  expired(date) {
    console.log(date);
  }
}
