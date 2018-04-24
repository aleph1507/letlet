import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Employee } from '../../../models/Employee';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.css']
})
export class EmployeeModalComponent implements OnInit {

  employee: Employee;
  employeeForm: FormGroup;
  oldID: number;

  constructor(public dialogRef: MatDialogRef<EmployeeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {id: number},
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.employee = this.resourcesService.employees.getEmplyeeById(this.data.id);
    }

    this.employeeForm = new FormGroup({
      'id': new FormControl(this.employee ? this.employee.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.employee ? this.employee.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'email': new FormControl(this.employee ? this.employee.email : '', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.employee = {
      id: this.employeeForm.controls['id'].value,
      name: this.employeeForm.controls['name'].value,
      email: this.employeeForm.controls['email'].value
    }
    if(this.data){
      this.resourcesService.employees.deleteEmployeeById(this.data.id);
      this.resourcesService.employees.addEmployee(this.employee);
    }
    else
      this.resourcesService.employees.addEmployee(this.employee);
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
