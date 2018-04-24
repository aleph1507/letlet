import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MatTableModule, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Company } from '../../models/Company';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../models/Vehicle.model';
import { DialogVehicleComponent } from '../../requester/dialog-vehicle/dialog-vehicle.component';
import { Employee } from '../../models/Employee';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';

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

  constructor(private resourcesService: ResourcesService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.category = params['category'];
      console.log('category: ', this.category);
      switch(this.category){
        case 'companies':
          this.category = 'companies';
          this.dataSource = new MatTableDataSource<Company>(this.resourcesService.companies.getCompanies());
          this.displayedColumns = ['name', 'id'];
          break;
        case 'vehicles':
          this.category = 'vehicles';
          this.dataSource = new MatTableDataSource<Vehicle>(this.resourcesService.vehicles.getAllVehicles());
          this.displayedColumns = ['model', 'plate', 'edit'];
          break;
        case 'employees':
          this.category = 'employees';
          this.dataSource = new MatTableDataSource<Employee>(this.resourcesService.employees.getAllEmployees());
          this.displayedColumns = ['id', 'name', 'email', 'edit'];
          break;
      }
    });

  }

  addResource(category) {
    console.log('category: ', category);
    switch(category){
      case 'companies':
        this.editCompany(null);
        break;
      case 'vehicles':
        this.editVehicle(null);
        break;
      case 'employees':
        this.editEmployee();
        break;
    }
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
    let data = v == null ? null : {vehicle: v.vehicle, index: v.index};
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: data
    });

    editVehicleDialogRef.afterClosed().subscribe(a => {
      this.applyFilter('');
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
