import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { VehicleBadge } from '../models/VehicleBadge';
import { VehicleBadgesService } from '../services/vehicle-badges.service';
import { VehicleBadgesCreateComponent } from './vehicle-badges-create/vehicle-badges-create.component';

@Component({
  selector: 'app-vehicle-badges',
  templateUrl: './vehicle-badges.component.html',
  styleUrls: ['./vehicle-badges.component.css']
})
export class VehicleBadgesComponent implements OnInit, AfterViewInit {

  displayedColumns = ['permitNumber', 'vehicleModel', 'vehiclePlate', 'vehicleCompany', 'expireDate', 'return', 'shreddingDate', 'edit'];

  dataSource: MatTableDataSource<VehicleBadge>;
  length: number;
  pageSize: number;
  vehicleBadges : VehicleBadge[];
  currentPage = 1;
  nextDisabled = false;
  prevDisabled = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private vehicleBadgesService: VehicleBadgesService,
              public dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef) { }

  showSpinner: boolean = true;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.showSpinner = true;
    this.vehicleBadgesService.getVehicleBadges(this.currentPage).subscribe((data : VehicleBadge[]) => {
      this.vehicleBadges = data;
      data == null ? this.vehicleBadges = [] : this.vehicleBadges = data;
      this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
      this.length = this.vehicleBadges.length;
      this.dataSource.paginator = this.paginator;
      this.pageSize = 10;
      this.changeDetectorRefs.detectChanges();
      this.showSpinner = false;
    });
  }

  prevPage(page: number) {
    this.showSpinner = true;
    if(this.currentPage > 1){
      this.currentPage--;
      this.vehicleBadgesService.getVehicleBadges(this.currentPage).subscribe((data : VehicleBadge[]) => {
          this.vehicleBadges = data;
          this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
          this.nextDisabled = false;
          this.showSpinner = false;
      });
    }
  }

  nextPage(page: number) {
    this.showSpinner = true;
    this.vehicleBadgesService.getVehicleBadges(this.currentPage+1).subscribe((data : VehicleBadge[]) => {
      if(data){
        this.currentPage++;
        this.vehicleBadges = data;
        this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
      } else {
        this.nextDisabled = true;
      }
      this.showSpinner = false;
    });
  }

  openDialog(id = null): void {
    let dialogRef;
    if(id != null){
      this.vehicleBadgesService.getVehicleBadgeById(id)
        .subscribe((res: VehicleBadge) => {
          dialogRef = this.dialog.open(VehicleBadgesCreateComponent, {
            width: '70%',
            data: res
          }).afterClosed().subscribe(result => {this.refresh()});
        })
    } else {
        dialogRef = this.dialog.open(VehicleBadgesCreateComponent, {
        width: '70%',
        data: null
      }).afterClosed().subscribe(result => {this.refresh()});
    }
  }

  applyFilter(filterValue: string) {
    this.showSpinner = true;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.vehicleBadgesService.filterVehicleBadges(filterValue)
      .subscribe((data: VehicleBadge[]) => {
        if(data){
          if(filterValue != ''){
            this.vehicleBadges = data;
            this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
          } else {
            this.vehicleBadgesService.getVehicleBadges(1)
              .subscribe((data: VehicleBadge[]) => {
                this.vehicleBadges = data;
                this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
              });
          }
        }
        this.showSpinner = false;
      });

      this.dataSource.filter = filterValue;
      this.showSpinner = false;
  }

  expired(b: VehicleBadge) {
    return new Date().getTime() - new Date(b.expireDate).getTime() < 0 ? false : true;
  }

}
