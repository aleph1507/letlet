import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MatTableModule, MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { Company } from '../../models/Company';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ActivatedRoute } from '@angular/router';
import { resourceVehicle } from '../../models/resourceVehicle';
import { DialogVehicleComponent } from '../../requester/dialog-vehicle/dialog-vehicle.component';
import { Employee } from '../../models/Employee';
import { Reason } from '../../models/Reason';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { ReasonModalComponent } from './reason-modal/reason-modal.component';
import { Gate } from '../../models/Gate';
import { GateModalComponent } from './gate-modal/gate-modal.component';
// import { Occupation } from '../../models/Occupation';
// import { OccupationModalComponent } from './occupation-modal/occupation-modal.component';
import { AirportZone } from '../../models/AirportZone';
import { AirportZoneModalComponent } from './airport-zone-modal/airport-zone-modal.component';
import { VisitorBadge } from '../../models/VisitorBadge';
import { VisitorBadgeModalComponent } from './visitor-badge-modal/visitor-badge-modal.component';
import { VisitorVehicleBadge } from '../../models/VisitorVehicleBadge';
import { VisitorVehicleBadgeModalComponent } from './visitor-vehicle-badge-modal/visitor-vehicle-badge-modal.component';
import { DialogResourceVehicleComponent } from './dialog-vehicle/dialog-vehicle.component';
import { FormControl } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle.model';
// import { EmployeesDataSource } from './data_sources/EmployeesDataSource';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  filterSpinner: boolean;
  vehicles: Vehicle[];
  lengthVehicles: any;

  // companies = this.resourcesService.companies();
  dataSource;
  displayedColumns;
  paramsSub: any;
  category;
  categoryTitle;
  currentPage = 1;
  currentPageComp = 1;
  currentPageVehicles = 1;
  employees: Employee[] = [];
  employees_auto: Employee[] = [];
  prev_employees: Employee[] = [];
  length = 0;
  pageSize = 10;
  nextDisabled = false;
  prevDisabled = true;
  nextDisabledComp = false;
  prevDisabledComp = true;
  nextDisabledVehicles = false;
  prevDisabledVehicles = true;
  companiesAutoCtrl: FormControl = new FormControl();
  employeeAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];
  companies: Company[] = [];

  showSpinner : boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private resourcesService: ResourcesService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.employeeAutoCtrl.valueChanges
      .subscribe(d => {
        this.resourcesService.employees.filterEmployees(d)
          .subscribe((data:Employee[]) => {
            this.employees_auto = data;
          });
      });
      this.companiesAutoCtrl.valueChanges
        .subscribe(d => {
          this.resourcesService.companies.filterCompanies(d)
            .subscribe((data:Company[]) => {
              this.companies_auto = data;
            });
        });
    this.paramsSub = this.route.params.subscribe(params => {
      this.showSpinner = true;
      this.category = params['category'];
      console.log('category: ', this.category);
      switch(this.category){
        case 'visitors-badges':
          this.category = 'visitors-badges';
          this.categoryTitle = 'Visitors Badges';
          // this.resourcesService.visitorBadges.getAllVisitorBadges();
          this.resourcesService.visitorBadges.getAllVisitorBadges()
            .subscribe((data : VisitorBadge[]) => {
              this.resourcesService.visitorBadges.visitorBadges = data;
              this.dataSource = new
                MatTableDataSource<VisitorBadge>(this.resourcesService.visitorBadges.visitorBadges);
                this.showSpinner = false;
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
                this.showSpinner = false;
            })
          this.displayedColumns = ['code', 'name', 'edit'];
          break;
        case 'companies':
          this.category = 'companies';
          this.categoryTitle = this.category;
          this.resourcesService.companies.getCompanies()
            .subscribe((data) => {
              this.resourcesService.companies.companies = data;
              this.dataSource = new
                MatTableDataSource<Company>(this.resourcesService.companies.companies);
                this.showSpinner = false;
            })
          this.displayedColumns = ['name', 'id'];
          break;
        case 'vehicles':
          this.category = 'vehicles';
          this.categoryTitle = this.category;
          this.resourcesService.vehicles.getVehiclesPage(this.currentPageVehicles)
            .subscribe((data: Vehicle[]) => {
              this.vehicles = data;
              this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
              // this.lengthVehicles = vehicles.length;
              this.showSpinner = false;
            });
          // this.resourcesService.vehicles.getAllVehicles()
          //   .subscribe((data : resourceVehicle[]) => {
          //     this.resourcesService.vehicles.vehicles = data;
          //     this.dataSource = new
          //       MatTableDataSource<resourceVehicle>(this.resourcesService.vehicles.vehicles);
          //       this.showSpinner = false;
          //   });
          this.displayedColumns = ['company', 'model', 'plate', 'edit'];
          break;
        case 'employees':
          this.category = 'employees';
          this.categoryTitle = this.category;

          this.resourcesService.employees.getEmployeesPage(this.currentPage)
            .subscribe((data: Employee[]) => {
              this.employees = data;
              this.dataSource = new MatTableDataSource<Employee>(this.employees);
              this.length = this.employees.length;
              this.dataSource.paginator = this.paginator;
              this.pageSize = 10;
              console.log('data: ', data);
              this.showSpinner = false;
            })
          // this.dataSource = new MatTableDataSource<Employee>(this.resourcesService.employees.getAllEmployees());

          // let dataSource: EmployeesDataSource = new EmployeesDataSource(this.resourcesService.employees);
          // this.dataSource.loadEmployees();

          // this.resourcesService.employees.getAllEmployees()
          //   .subscribe((data) => {
          //     this.resourcesService.employees.employees = data;
          //     this.dataSource = new
          //       MatTableDataSource<Employee>(this.resourcesService.employees.employees);
          //       this.dataSource.paginator = this.paginator;
          //   });
          this.displayedColumns = ['name', 'surname', 'company', 'edit'];
          break;
        case 'reasons':
          this.category = 'reasons';
          this.categoryTitle = this.category;
          this.resourcesService.reasons.getAllReasons()
            .subscribe((data) => {
              this.resourcesService.reasons.reasons = data;
              this.dataSource = new
                MatTableDataSource<Reason>(this.resourcesService.reasons.reasons);
                this.showSpinner = false;
              })
            this.displayedColumns = ['name', 'edit'];
          break;
        case 'gates':
          this.category = 'gates';
          this.categoryTitle = this.category;
          this.resourcesService.gates.getAllGates()
            .subscribe((data) => {
              this.resourcesService.gates.gates = data;
              this.dataSource = new
              MatTableDataSource<Gate>(this.resourcesService.gates.gates);
                this.showSpinner = false;
              })
          this.displayedColumns = ['name', 'edit'];
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
                this.showSpinner = false;
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
      // case 'occupations':
      //   this.editOccupation();
      //   break;
      case 'zones':
        this.editZone();
        break;
    }
  }

  displayEmpFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
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

  // editOccupation(id = null) {
  //   let dialogRef = this.dialog.open(OccupationModalComponent, {
  //     width: '40%',
  //     data: id
  //   });
  //
  //   dialogRef.afterClosed().subscribe(a => {
  //     this.applyFilter('');
  //   });
  // }

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
    // let e: Employee = this.resourcesService.employees.getEmplyeeById(id);
    let dialogRef = this.dialog.open(EmployeeModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  prevPageEmp(page: number) {
    this.showSpinner = true;
    // console.log('vo prev page');
    if(this.currentPage > 1){
      this.currentPage--;
      this.resourcesService.employees.getEmployeesPage(this.currentPage).subscribe((data : Employee[]) => {
        // console.log('vo prev subscription data: ' + data);
          this.employees = data;
          // console.log('this.badges : ' + this.badges);
          this.dataSource = new MatTableDataSource<Employee>(this.employees);
          this.nextDisabled = false;
          this.showSpinner = false;
      });
    }
  }

  prevPageComp(page: number) {
    this.showSpinner = true;
    // console.log('vo prev page');
    if(this.currentPageComp > 1){
      this.currentPageComp--;
      this.resourcesService.companies.getCompaniesPage(this.currentPageComp).subscribe((data : Company[]) => {
        // console.log('vo prev subscription data: ' + data);
          this.companies = data;
          // console.log('this.badges : ' + this.badges);
          this.dataSource = new MatTableDataSource<Company>(this.companies);
          this.nextDisabledComp = false;
          this.showSpinner = false;
      });
    }
  }

  nextPageEmp(page: number) {
    this.showSpinner = true;
    // console.log('vo next page');
    this.resourcesService.employees.getEmployeesPage(this.currentPage+1).subscribe((data : Employee[]) => {
      // console.log('vo next subscription data: ' + data);
      if(data){
        this.currentPage++;
        this.employees = data;
        // console.log('this.badges : ' + this.badges);
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
      } else {
        this.nextDisabled = true;
      }
      this.showSpinner = false;
    });
  }

  nextPageVehicles(page: number) {
    this.showSpinner = true;
    // console.log('vo next page');
    this.resourcesService.vehicles.getVehiclesPage(this.currentPage+1).subscribe((data : Vehicle[]) => {
      // console.log('vo next subscription data: ' + data);
      if(data){
        this.currentPageVehicles++;
        this.vehicles = data;
        // console.log('this.badges : ' + this.badges);
        this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
      } else {
        this.nextDisabledVehicles = true;
      }
      this.showSpinner = false;
    });
  }

  nextPageComp(page: number) {
    this.showSpinner = true;
    // console.log('vo next page');
    this.resourcesService.companies.getCompaniesPage(this.currentPageComp+1).subscribe((data : Company[]) => {
      // console.log('vo next subscription data: ' + data);
      if(data){
        this.currentPageComp++;
        this.companies = data;
        // console.log('this.badges : ' + this.badges);
        this.dataSource = new MatTableDataSource<Company>(this.companies);
      } else {
        this.nextDisabledComp = true;
      }
      this.showSpinner = false;
    });
  }

  editCompany(id = null): void {
    let dialogRef = this.dialog.open(CompanyModalComponent, {
      width: '40%',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  editVehicle(id: number = null){
    // var v = null;
    // this.resourcesService.vehicles.getVehicleByIndex(id);
    // let data = v == null ? {resource: true} : {vehicle: v.vehicle, i: v.index, resource: true};

    let editVehicleDialogRef = this.dialog.open(DialogResourceVehicleComponent, {
      width: '45vw',
      data: id
    });

    editVehicleDialogRef.afterClosed().subscribe(a => {
      console.log('after edit resService.vehicles: ', this.resourcesService.vehicles.getAllVehicles());
      this.applyFilter('');
    });
  }

  applyFilter(filterValue: string) {
    // this.showSpinner = true;
    // this.filterSpinner = true;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if(this.category == 'employees'){
      this.resourcesService.employees.filterEmployees(filterValue)
        .subscribe((data: Employee[]) => {
          if(data){
            if(filterValue != ''){
              this.employees = data;
              this.dataSource = new MatTableDataSource<Employee>(this.employees);
            } else {
              this.resourcesService.employees.getEmployeesPage(1)
                .subscribe((data: Employee[]) => {
                  this.employees = data;
                  this.dataSource = new MatTableDataSource<Employee>(this.employees);
                });
            }
          }
          this.showSpinner = false;
        });
    } else if(this.category == 'companies') {
      this.resourcesService.companies.filterCompanies(filterValue)
        .subscribe((data: Company[]) => {
          if(data){
            if(filterValue != ''){
              this.companies = data;
              this.dataSource = new MatTableDataSource<Company>(this.companies);
            } else {
              this.resourcesService.companies.getCompaniesPage(1)
                .subscribe((data: Company[]) => {
                  this.companies = data;
                  this.dataSource = new MatTableDataSource<Company>(this.companies);
                });
            }
          }
          this.showSpinner = false;
        })
    } else if(this.category == 'vehicles') {
      console.log('filterValue vehicles: ', filterValue);
      this.resourcesService.vehicles.filterVehicles(filterValue)
        .subscribe((data: Vehicle[]) => {
          if(data){
            if(filterValue != ''){
              this.vehicles = data;
              this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
            } else {
              this.resourcesService.vehicles.getVehiclesPage(1)
                .subscribe((data: Vehicle[]) => {
                  this.vehicles = data;
                  this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
                })
            }
          }
          this.showSpinner = false;
        })
    } else {
      this.dataSource.filter = filterValue;
      this.showSpinner = false;
    }
  }
}
