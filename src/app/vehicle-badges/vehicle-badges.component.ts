import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { VehicleBadge } from '../models/VehicleBadge';
import { VehicleBadgesService } from '../services/vehicle-badges.service';

@Component({
  selector: 'app-vehicle-badges',
  templateUrl: './vehicle-badges.component.html',
  styleUrls: ['./vehicle-badges.component.css']
})
export class VehicleBadgesComponent implements OnInit {

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

  ngOnInit() {
  }

  refresh() {
    this.vehicleBadgesService.getVehicleBadges(this.currentPage).subscribe((data : VehicleBadge[]) => {
      this.vehicleBadges = data;
      this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
      this.length = this.vehicleBadges.length;
      this.dataSource.paginator = this.paginator;
      this.pageSize = 10;
      this.changeDetectorRefs.detectChanges();
    });
  }

  prevPage(page: number) {
    // console.log('vo prev page');
    if(this.currentPage > 1){
      this.currentPage--;
      this.vehicleBadgesService.getVehicleBadges(this.currentPage).subscribe((data : VehicleBadge[]) => {
        // console.log('vo prev subscription data: ' + data);
          this.vehicleBadges = data;
          // console.log('this.badges : ' + this.badges);
          this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
          this.nextDisabled = false;
      });
    }
  }

  nextPage(page: number) {
    // console.log('vo next page');
    this.vehicleBadgesService.getVehicleBadges(this.currentPage+1).subscribe((data : VehicleBadge[]) => {
      // console.log('vo next subscription data: ' + data);
      if(data){
        this.currentPage++;
        this.vehicleBadges = data;
        // console.log('this.badges : ' + this.badges);
        this.dataSource = new MatTableDataSource<VehicleBadge>(this.vehicleBadges);
      } else {
        this.nextDisabled = true;
      }
    });
  }

}
