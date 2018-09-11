import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Employee } from '../../../models/Employee';
import { Company } from '../../../models/Company';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar.service';

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
  companiesAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];

  constructor(public dialogRef: MatDialogRef<EmployeeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
      this.companiesAutoCtrl.valueChanges
        .subscribe(d => {
          this.resourcesService.companies.filterCompanies(d)
            .subscribe((data:Company[]) => {
              console.log('company: ', data);
              this.companies_auto = data;
            });
        });

    if(this.data){
      this.resourcesService.employees.getEmplyeeById(this.data)
        .subscribe((data : Employee) => {
          this.oldID = data.id;
          this.employee = data;
          this.companiesAutoCtrl.setValue(this.employee.company);
          this.employeeForm = new FormGroup({
            'name': new FormControl(this.employee ? this.employee.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'surname': new FormControl(this.employee ? this.employee.surname : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'occupation': new FormControl(this.employee ? this.employee.occupation : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
          });
        });
    }

    this.employeeForm = new FormGroup({
      'occupation': new FormControl(this.employee ? this.employee.occupation : '', {
        validators: [Validators.required],
        updateOn: 'change'
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
      company: this.companiesAutoCtrl.value,
      occupation: this.employeeForm.controls['occupation'].value
    }
    if(this.data){
      this.resourcesService.employees.updateEmployee(this.employee)
        .subscribe((data : Employee) => {
          this.resourcesService.employees.switchEmployeeById(data);
          this.snackbarService.successSnackBar("Employee successfully updated");
        })
    }
    else
      this.resourcesService.employees.addEmployee(this.employee)
        .subscribe((data : Employee) => {
          this.resourcesService.employees.pushEmployee(data);
          this.snackbarService.successSnackBar("Employee successfully added");
        });

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
