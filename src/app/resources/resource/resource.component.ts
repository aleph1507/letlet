import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MatTableModule, MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { Company } from '../../models/Company';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { resourceVehicle } from '../../models/resourceVehicle';
import { DialogVehicleComponent } from '../../requester/dialog-vehicle/dialog-vehicle.component';
import { Employee } from '../../models/Employee';
import { Reason } from '../../models/Reason';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { ReasonModalComponent } from './reason-modal/reason-modal.component';
import { Gate } from '../../models/Gate';
import { GateModalComponent } from './gate-modal/gate-modal.component';
import { AirportZone } from '../../models/AirportZone';
import { AirportZoneModalComponent } from './airport-zone-modal/airport-zone-modal.component';
import { VisitorBadge } from '../../models/VisitorBadge';
import { VisitorBadgeModalComponent } from './visitor-badge-modal/visitor-badge-modal.component';
import { VisitorVehicleBadge } from '../../models/VisitorVehicleBadge';
import { VisitorVehicleBadgeModalComponent } from './visitor-vehicle-badge-modal/visitor-vehicle-badge-modal.component';
import { DialogResourceVehicleComponent } from './dialog-vehicle/dialog-vehicle.component';
import { FormControl } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  filterSpinner: boolean;
  vehicles: Vehicle[];
  lengthVehicles: any;

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
              private router: Router,
              private changeDetectorRefs: ChangeDetectorRef,
              private snackbarService: SnackbarService) { }

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
      switch(this.category){
        case 'visitors-badges':
          this.category = 'visitors-badges';
          this.categoryTitle = 'Visitors Badges';
          this.resourcesService.visitorBadges.getAllVisitorBadges()
            .subscribe((data : VisitorBadge[]) => {
              data == null ? this.resourcesService.visitorBadges.visitorBadges = [] :
                 this.resourcesService.visitorBadges.visitorBadges = data;
              this.dataSource = new
                MatTableDataSource<VisitorBadge>(this.resourcesService.visitorBadges.visitorBadges);
                this.showSpinner = false;
            });

          //192.168.100.4:84/api/visitorbadges
          this.displayedColumns = ['name', 'barcode', 'edit', 'delete'];
          break;
        case 'visitors-vehicle-badges':
          this.category = 'visitors-vehicle-badges';
          this.categoryTitle = 'Visitors Vehicle Badges';
          this.resourcesService.visitorVehicleBadges.getAllVisitorVehicleBadges()
            .subscribe((data) => {
              data == null ? this.resourcesService.visitorVehicleBadges.visitorVehicleBadges = [] :
                this.resourcesService.visitorVehicleBadges.visitorVehicleBadges = data;
              this.dataSource = new
                MatTableDataSource<VisitorVehicleBadge>(this.resourcesService.visitorVehicleBadges.visitorVehicleBadges);
                this.showSpinner = false;
            })
          this.displayedColumns = ['code', 'name', 'edit', 'delete'];
          break;
        case 'companies':
          this.category = 'companies';
          this.categoryTitle = this.category;
          this.resourcesService.companies.getCompaniesPage(1)
            .subscribe((data) => {
              data == null ? this.resourcesService.companies.companies = [] :
                this.resourcesService.companies.companies = data;
              this.dataSource = new
                MatTableDataSource<Company>(this.resourcesService.companies.companies);
                this.showSpinner = false;
            })
          this.displayedColumns = ['name', 'nameEn', 'id'];
          break;
        case 'vehicles':
          this.category = 'vehicles';
          this.categoryTitle = this.category;
          this.resourcesService.vehicles.getVehiclesPage(this.currentPageVehicles)
            .subscribe((data: Vehicle[]) => {
              data == null ? this.vehicles = [] :
                this.vehicles = data;
              this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
              this.showSpinner = false;
            });
          this.displayedColumns = ['company', 'model', 'plate', 'edit'];
          break;
        case 'employees':
          this.category = 'employees';
          this.categoryTitle = this.category;

          this.resourcesService.employees.getEmployeesPage(this.currentPage)
            .subscribe((data: Employee[]) => {
              data == null ? this.employees = [] :
                this.employees = data;
              this.dataSource = new MatTableDataSource<Employee>(this.employees);
              this.length = this.employees.length;
              this.dataSource.paginator = this.paginator;
              this.pageSize = 10;
              this.showSpinner = false;
            });
          this.displayedColumns = ['name', 'surname', 'company', 'occupation', 'edit'];
          break;
        case 'gates':
          this.category = 'gates';
          this.categoryTitle = this.category;
          this.resourcesService.gates.getAllGates()
            .subscribe((data) => {
              data == null ? this.resourcesService.gates.gates = [] :
                this.resourcesService.gates.gates = data;
              this.dataSource = new
              MatTableDataSource<Gate>(this.resourcesService.gates.gates);
                this.showSpinner = false;
              })
          this.displayedColumns = ['name', 'edit', 'delete'];
          break;
        case 'occupations':
          this.category = 'occupations';
          this.categoryTitle = this.category;
          this.displayedColumns = ['id', 'code', 'name', 'edit', 'delete'];
          break;
        case 'zones':
          this.category = 'zones';
          this.categoryTitle = this.category;
          this.resourcesService.airportZones.getAllAirportZones()
            .subscribe((data) => {
              data == null ? this.resourcesService.airportZones.airportZones = [] :
                this.resourcesService.airportZones.airportZones = data;
              this.dataSource = new
              MatTableDataSource<AirportZone>(this.resourcesService.airportZones.airportZones);
                this.showSpinner = false;
              })
          this.displayedColumns = ['code', 'name', 'edit', 'delete'];
          break;
      }
    });

  }

  addResource(category) {
    switch(category){
      case 'visitors-badges':
        this.editVisitorsBadge();
        break;
      case 'visitors-vehicle-badges':
        this.editVisitorVehiclesBadge();
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
      case 'gates':
        this.editGate();
        break;
      case 'zones':
        this.editZone();
        break;
    }
  }

  displayEmpFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
  }

  editVisitorVehiclesBadge(id = null){
    let dialogRef = this.dialog.open(VisitorVehicleBadgeModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  deleteVisitorVehicleBadge(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.visitorVehicleBadges.deleteVisitorVehicleBadge(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Visitor Vehicle Badge successfully deleted");
          this.applyFilter('');
          this.changeDetectorRefs.detectChanges();
        });
    }
    this.applyFilter('');
    this.changeDetectorRefs.detectChanges();
    this.router.navigate(['/resources/visitors-vehicle-badges']);
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

  deleteVisitorsBadge(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.visitorBadges.deleteVisitorBadge(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Visitor Badge successfully deleted");
          this.applyFilter('');
        });
    }
  }

  editZone(id = null) {
    let dialogRef = this.dialog.open(AirportZoneModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.changeDetectorRefs.detectChanges();
      this.applyFilter('');
    });
  }

  deleteZone(id = null){
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.airportZones.deleteAirportZone(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Airport zone successfully deleted");
          this.applyFilter('');
        });
    }
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

  deleteGate(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.gates.deleteGate(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Gate successfully deleted");
          this.applyFilter('');
        });
    }
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

  deleteReason(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.reasons.deleteReason(id)
        .subscribe(data => {
          this.applyFilter('');
          this.snackbarService.successSnackBar("Reason successfully deleted");
        });
    }
  }

  editEmployee(id = null){
    let dialogRef = this.dialog.open(EmployeeModalComponent, {
      width: '40%',
      data: id
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  deleteEmployee(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.employees.deleteEmployee(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Employee successfully deleted");
          this.applyFilter('');
        });
    }
  }

  prevPageEmp(page: number) {
    this.showSpinner = true;
    if(this.currentPage > 1){
      this.currentPage--;
      this.resourcesService.employees.getEmployeesPage(this.currentPage).subscribe((data : Employee[]) => {
          this.employees = data;
          this.dataSource = new MatTableDataSource<Employee>(this.employees);
          this.nextDisabled = false;
          this.showSpinner = false;
      });
    }
  }

  prevPageComp(page: number) {
    this.showSpinner = true;
    if(this.currentPageComp > 1){
      this.currentPageComp--;
      this.resourcesService.companies.getCompaniesPage(this.currentPageComp).subscribe((data : Company[]) => {
          this.companies = data;
          this.dataSource = new MatTableDataSource<Company>(this.companies);
          this.nextDisabledComp = false;
          this.showSpinner = false;
      });
    }
  }

  prevPageVehicles() {
    this.showSpinner = true;
    this.resourcesService.vehicles.getVehiclesPage(this.currentPage).subscribe((data : Vehicle[]) => {
      if(data){
        this.currentPageVehicles--;
        this.vehicles = data;
        this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
      } else {
        this.nextDisabledVehicles = false;
      }
      this.showSpinner = false;
    });
  }

  deleteCompany(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.companies.deleteCompany(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Company successfully deleted");
          this.applyFilter('');
        });
    }
  }

  nextPageEmp(page: number) {
    this.showSpinner = true;
    this.resourcesService.employees.getEmployeesPage(this.currentPage+1).subscribe((data : Employee[]) => {
      if(data){
        this.currentPage++;
        this.employees = data;
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
      } else {
        this.nextDisabled = true;
      }
      this.showSpinner = false;
    });
  }

  nextPageVehicles() {
    this.showSpinner = true;
    this.resourcesService.vehicles.getVehiclesPage(this.currentPage+1).subscribe((data : Vehicle[]) => {
      if(data){
        this.currentPageVehicles++;
        this.vehicles = data;
        this.dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
      } else {
        this.nextDisabledVehicles = true;
      }
      this.showSpinner = false;
    });
  }

  nextPageComp(page: number) {
    this.showSpinner = true;
    this.resourcesService.companies.getCompaniesPage(this.currentPageComp+1).subscribe((data : Company[]) => {
      if(data){
        this.currentPageComp++;
        this.companies = data;
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
    let editVehicleDialogRef = this.dialog.open(DialogResourceVehicleComponent, {
      width: '45vw',
      data: id
    });

    editVehicleDialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  deleteVehicle(id = null) {
    let cDelete = confirm("Are you sure");
    if(cDelete){
      this.resourcesService.vehicles.deleteVehicle(id)
        .subscribe(data => {
          this.snackbarService.successSnackBar("Vehicle successfully deleted");
          this.applyFilter('');
        });
    }
  }

  applyFilter(filterValue: string) {
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
