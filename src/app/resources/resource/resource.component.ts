import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MatTableModule, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Company } from '../../models/Company';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../models/Vehicle.model';
import { DialogVehicleComponent } from '../../requester/dialog-vehicle/dialog-vehicle.component';
import { Employee } from '../../models/Employee';
import { Reason } from '../../models/Reason';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { ReasonModalComponent } from './reason-modal/reason-modal.component';
import { Gate } from '../../models/Gate';
import { GateModalComponent } from './gate-modal/gate-modal.component';
import { Occupation } from '../../models/Occupation';
import { OccupationModalComponent } from './occupation-modal/occupation-modal.component';
import { AirportZone } from '../../models/AirportZone';
import { AirportZoneModalComponent } from './airport-zone-modal/airport-zone-modal.component';
import { VisitorBadge } from '../../models/VisitorBadge';
import { VisitorBadgeModalComponent } from './visitor-badge-modal/visitor-badge-modal.component';
import { VisitorVehicleBadge } from '../../models/VisitorVehicleBadge';
import { VisitorVehicleBadgeModalComponent } from './visitor-vehicle-badge-modal/visitor-vehicle-badge-modal.component';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {

  // companies = this.resourcesService.companies();
  dataSource;
  displayedColumns;
  paramsSub: any;
  category;
  categoryTitle;

  constructor(private resourcesService: ResourcesService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.category = params['category'];
      console.log('category: ', this.category);
      switch(this.category){
        case 'visitors-badges':
          this.category = 'visitors-badges';
          this.categoryTitle = 'Visitors Badges';
          // this.resourcesService.visitorBadges.getAllVisitorBadges();
          this.resourcesService.visitorBadges.getAllVisitorBadges()
            .subscribe((data) => {
              this.resourcesService.visitorBadges.visitorBadges = data;
              this.dataSource = new
                MatTableDataSource<VisitorBadge>(this.resourcesService.visitorBadges.visitorBadges);
            });

          //192.168.100.4:84/api/visitorbadges
          this.displayedColumns = ['code', 'name', 'barcode', 'edit'];
          break;
        case 'visitors-vehicle-badges':
          // console.log('VO VISITOR VEHICLE BADGES');
          this.category = 'visitors-vehicle-badges';
          this.categoryTitle = 'Visitors Vehicle Badges';
          this.resourcesService.visitorVehicleBadges.getAllVisitorVehicleBadges()
            .subscribe((data) => {
              this.resourcesService.visitorVehicleBadges.visitorVehicleBadges = data;
              this.dataSource = new
                MatTableDataSource<VisitorVehicleBadge>(this.resourcesService.visitorVehicleBadges.visitorVehicleBadges);
            })
          this.displayedColumns = ['code', 'name', 'edit'];
          break;
        case 'companies':
          this.category = 'companies';
          this.categoryTitle = this.category;
          this.dataSource = new MatTableDataSource<Company>(this.resourcesService.companies.getCompanies());
          this.displayedColumns = ['name', 'id'];
          break;
        case 'vehicles':
          this.category = 'vehicles';
          this.categoryTitle = this.category;
          this.dataSource = new MatTableDataSource<Vehicle>(this.resourcesService.vehicles.getAllVehicles());
          this.displayedColumns = ['company', 'model', 'plate', 'edit'];
          break;
        case 'employees':
          this.category = 'employees';
          this.categoryTitle = this.category;
          // this.dataSource = new MatTableDataSource<Employee>(this.resourcesService.employees.getAllEmployees());
          // this.resourcesService.employees.getAllEmployees()
          //   .subscribe((data) => {
          //     this.resourcesService.visitorBadges.visitorBadges = data;
          //     this.dataSource = new
          //       MatTableDataSource<VisitorBadge>(this.resourcesService.visitorBadges.visitorBadges);
          //   });
          this.displayedColumns = ['id', 'name', 'email', 'edit'];
          break;
        case 'reasons':
          this.category = 'reasons';
          this.categoryTitle = this.category;
          // this.dataSource = new MatTableDataSource<Reason>(this.resourcesService.reasons.getAllReasons());
          this.displayedColumns = ['id', 'code', 'name', 'edit'];
          break;
        case 'gates':
          this.category = 'gates';
          this.categoryTitle = this.category;
          // this.dataSource = new MatTableDataSource<Gate>(this.resourcesService.gates.getAllGates());
          this.displayedColumns = ['id', 'code', 'name', 'edit'];
          break;
        case 'occupations':
          this.category = 'occupations';
          this.categoryTitle = this.category;
          // this.dataSource = new MatTableDataSource<Occupation>(this.resourcesService.occupations.getAllOccupations());
          this.displayedColumns = ['id', 'code', 'name', 'edit'];
          break;
        case 'zones':
          this.category = 'zones';
          this.categoryTitle = this.category;
          this.resourcesService.airportZones.getAllAirportZones()
            .subscribe((data) => {
              console.log('zones: ' + data);
              this.resourcesService.airportZones.airportZones = data;
              this.dataSource = new
                MatTableDataSource<AirportZone>(this.resourcesService.airportZones.airportZones);
            })
          // this.dataSource = new MatTableDataSource<AirportZone>(this.resourcesService.airportZones.getAllAirportZones());
          this.displayedColumns = ['code', 'name', 'edit'];
          break;
      }
    });

  }

  addResource(category) {
    console.log('category: ', category);
    switch(category){
      case 'visitors-badges':
        this.editVisitorsBadge();
        break;
      case 'visitors-vehicle-badges':
        this.editVisitorVehicleBadge();
        break;
      case 'companies':
        this.editCompany(null);
        break;
      case 'vehicles':
        this.editVehicle(null);
        break;
      case 'employees':
        this.editEmployee();
        break;
      case 'reasons':
        this.editReason();
        break;
      case 'gates':
        this.editGate();
        break;
      case 'occupations':
        this.editOccupation();
        break;
      case 'zones':
        this.editZone();
        break;
    }
  }

  editVisitorVehicleBadge(id = null){
    let dialogRef = this.dialog.open(VisitorVehicleBadgeModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editVisitorsBadge(id = null){
    let dialogRef = this.dialog.open(VisitorBadgeModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editZone(id = null) {
    let dialogRef = this.dialog.open(AirportZoneModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editOccupation(id = null) {
    let dialogRef = this.dialog.open(OccupationModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editGate(id = null) {
    let dialogRef = this.dialog.open(GateModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editReason(id = null){
    let dialogRef = this.dialog.open(ReasonModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editEmployee(id = null){
    let e: Employee = this.resourcesService.employees.getEmplyeeById(id);
    let dialogRef = this.dialog.open(EmployeeModalComponent, {
      width: '40%',
      data: e
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editCompany(id): void {
    let dialogRef = this.dialog.open(CompanyModalComponent, {
      width: '40%',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editVehicle(plate: string){
    let v = this.resourcesService.vehicles.getVehicleByPlate(plate);
    let data = v == null ? {resource: true} : {vehicle: v.vehicle, i: v.index, resource: true};
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: data
    });

    editVehicleDialogRef.afterClosed().subscribe(a => {
      console.log('after edit resService.vehicles: ', this.resourcesService.vehicles.getAllVehicles());
      this.applyFilter('');
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
