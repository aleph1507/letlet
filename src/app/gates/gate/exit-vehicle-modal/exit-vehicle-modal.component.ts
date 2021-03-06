import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
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

  @ViewChild(MatAutocompleteTrigger) entEmp: MatAutocompleteTrigger;

  id: number = null;
  employees : Employee[] = [];
  gid : number = null;
  ExitVehicleForm : FormGroup = null;
  paid : boolean = false;
  o_paid : boolean = false;
  billNumber = null;
  nDays:number;

  constructor(private dialogRef: MatDialogRef<ExitVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { ev: EnteredVehicle, gid: number },
              private resourcesService : ResourcesService,
              private gatesService : GatesService) { }

  ngOnInit() {

    this.paid = this.data.ev.pay;
    this.o_paid = this.paid;

    this.ExitVehicleForm = new FormGroup({
      'exitEmployee': new FormControl('',{
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'paid': new FormControl(this.paid),
      'billNumber': new FormControl('', {
        updateOn: 'change'
      })
    });

    this.ExitVehicleForm.controls['exitEmployee'].valueChanges
      .subscribe(d => {
        if(d === ''){
          this.employees = [];
        }
      });

    this.ExitVehicleForm.controls['exitEmployee'].valueChanges
      .subscribe(d => {
        if(typeof d === 'string' && d != '') {
          this.resourcesService.employees.filterEntryEmployees(d)
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((data: Employee[]) => {
              this.employees = data;
              if(data.length == 1){
                this.selectEmp();
              }
            });
        }
      });

    if(this.paid){
      if(this.o_paid)
        this.ExitVehicleForm.controls['paid'].disable();
      this.ExitVehicleForm.get('billNumber').setValidators([Validators.required]);
    }

    this.nDays = Math.ceil((Date.parse(new Date().toString()) - Date.parse(this.data.ev.entryTime.toString())) / 1000 / 3600 / 24);
  }

  selectEmp() {
    if(this.employees.length == 1){
      this.ExitVehicleForm.controls['exitEmployee'].setValue(this.employees[0]);
      this.entEmp.closePanel();
    }
  }

  displayFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname: undefined;
  }

  onPaid(event){
    this.paid = !this.paid;
  }

  onSubmit() {
    var ee = this.ExitVehicleForm.controls['exitEmployee'].value;
    this.paid = this.ExitVehicleForm.controls['paid'].value;
    this.billNumber = this.ExitVehicleForm.controls['billNumber'].value;
    let exitVehicle = {
      'id': this.data.ev.id,
      'exitGate': {
        'id': this.data.gid
      },
      'paid': this.paid,
      'billNumber': this.billNumber,
      'exitEmployee': {
        'id': ee.id
      },
    }

    this.gatesService.postVehicleExit(exitVehicle)
      .subscribe((res) => {
          this.gatesService.getAllExpectedVehicles()
            .subscribe((res: ExpectedVehicle[]) => {
              this.dialogRef.close({id: this.data.ev.id, expectedVehicles: res});
            })
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
