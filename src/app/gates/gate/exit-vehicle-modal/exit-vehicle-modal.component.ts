import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnteredVehicle } from '../../../models/EnteredVehicle.model';
import { ResourcesService } from '../../../services/resources.service';
import { GatesService } from '../../../services/gates.service';
import { Employee } from '../../../models/Employee';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ExpectedVehicle } from '../../../models/ExpectedVehicle.model';

@Component({
  selector: 'app-exit-vehicle-modal',
  templateUrl: './exit-vehicle-modal.component.html',
  styleUrls: ['./exit-vehicle-modal.component.css']
})
export class ExitVehicleModalComponent implements OnInit {

  id: number = null;
  employees : Employee[] = [];
  gid : number = null;
  ExitVehicleForm : FormGroup = null;

  constructor(private dialogRef: MatDialogRef<ExitVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { ev: EnteredVehicle, gid: number },
              private resourcesService : ResourcesService,
              private gatesService : GatesService) { }

  ngOnInit() {
    this.resourcesService.employees.getAllEmployees()
      .subscribe((emps : Employee[]) => {
        this.employees = emps;
      });

    this.ExitVehicleForm = new FormGroup({
      'exitEmployee': new FormControl('',{
        validators: [Validators.required],
        updateOn: 'change'
      }),
    });
  }

  displayFn(e?: Employee) {
    return e ? e.name : undefined;
  }

  onSubmit() {
    console.log('vo submit')
    var ee = this.ExitVehicleForm.controls['exitEmployee'].value;
    console.log('this.data: ' + this.data);
    console.log('this.data.gid: ' + this.data.gid);
    console.log('this.data.ev: ' + this.data.ev);
    let exitVehicle = {
      'id': this.data.ev.id,
      'exitGate': {
        'id': this.data.gid
      },
      'exitEmployee': {
        'id': ee.id
      },
    }

    this.gatesService.postVehicleExit(exitVehicle)
      .subscribe((res) => {
        console.log('vo postVehicleExit subscription');
        console.log('res: ' + res);
          this.gatesService.getAllExpectedVehicles()
            .subscribe((res: ExpectedVehicle[]) => {
              console.log('vo getAllExpectedVehicles subscription')
              this.dialogRef.close({id: this.data.ev.id, expectedVehicles: res});
            })
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
