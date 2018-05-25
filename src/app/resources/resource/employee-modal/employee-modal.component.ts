import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Employee } from '../../../models/Employee';
import { Company } from '../../../models/Company';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.css']
})
export class EmployeeModalComponent implements OnInit {

  employee: Employee;
  employeeForm: FormGroup;
  oldID: number = null;
  companies : Company[] = [];

  constructor(public dialogRef: MatDialogRef<EmployeeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.resourcesService.companies.getCompanies()
      .subscribe((data: Company[]) => {
        this.companies = data;
        console.log('companies: ' + this.companies);
      });

    if(this.data){
      console.log('data : ' + this.data);
      this.resourcesService.employees.getEmplyeeById(this.data)
        .subscribe((data : Employee) => {
          this.oldID = data.id;
          this.employee = data;
          this.employeeForm = new FormGroup({
            'name': new FormControl(this.employee ? this.employee.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'surname': new FormControl(this.employee ? this.employee.surname : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'company': new FormControl(this.employee ? this.employee.company : '', {
              validators: Validators.required
            }),
          });
        });
    }

    this.employeeForm = new FormGroup({
      'company': new FormControl(this.employee ? this.employee.company : '', {
        validators: Validators.required
      }),
      'name': new FormControl(this.employee ? this.employee.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'surname': new FormControl(this.employee ? this.employee.surname : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  displayFn(c?: Company) {
    return c ? c.name : undefined;
  }

  onSubmit() {
    this.employee = {
      id: this.oldID,
      name: this.employeeForm.controls['name'].value,
      surname: this.employeeForm.controls['surname'].value,
      company: this.employeeForm.controls['company'].value
    }
    if(this.data){
      // this.resourcesService.employees.deleteEmployeeById(this.data.id);
      // this.resourcesService.employees.addEmployee(this.employee);
      this.resourcesService.employees.updateEmployee(this.employee)
        .subscribe((data : Employee) => {
          this.resourcesService.employees.switchEmployeeById(data)
        })
    }
    else
      this.resourcesService.employees.addEmployee(this.employee)
        .subscribe((data : Employee) => {
          this.resourcesService.employees.pushEmployee(data);
        });

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
