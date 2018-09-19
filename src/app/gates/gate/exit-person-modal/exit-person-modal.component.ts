import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { Employee } from '../../../models/Employee';
import { ResourcesService } from '../../../services/resources.service';
import { GatesService } from '../../../services/gates.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnteredPerson } from '../../../models/EnteredPerson.model';
import { ExpectedPerson } from '../../../models/ExpectedPerson.model';

@Component({
  selector: 'app-exit-person-modal',
  templateUrl: './exit-person-modal.component.html',
  styleUrls: ['./exit-person-modal.component.css']
})
export class ExitPersonModalComponent implements OnInit {

  id: number = null;
  employees : Employee[] = [];
  gid : number = null;
  paid : boolean = false;
  o_paid : boolean = false;
  billNumber : string = null;
  ExitPersonForm : FormGroup = null;
  dateDifference;
  nDays: number;

  @ViewChild(MatAutocompleteTrigger) entEmp: MatAutocompleteTrigger;


  constructor(private dialogRef: MatDialogRef<ExitPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { ep: EnteredPerson, gid: number },
              private resourcesService : ResourcesService,
              private gatesService : GatesService) { }

  ngOnInit() {
    this.paid = this.data.ep.pay;
    this.o_paid = this.paid;

    this.ExitPersonForm = new FormGroup({
      'exitEmployee': new FormControl('',{
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'paid': new FormControl(this.paid),
      'billNumber': new FormControl('', {
        updateOn: 'change'
      })
    });

  this.ExitPersonForm.controls['exitEmployee'].valueChanges
    .subscribe(d => {
      if(d === ''){
        this.employees = [];
      }
    });

    this.ExitPersonForm.controls['exitEmployee'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(d => {
        if(typeof d == 'string'  && d != ''){
          this.resourcesService.employees.filterEntryEmployees(d)
          .subscribe((data: Employee[]) => {
            this.employees = data;
            if(data.length == 1){
              this.selectEmp();
            }
          });
        }
      });

    if(this.paid){
      if(this.o_paid){
        this.ExitPersonForm.controls['paid'].disable();
      }
      this.ExitPersonForm.get('billNumber').setValidators([Validators.required]);
    }

    this.nDays = Math.ceil((Date.parse(new Date().toString()) - Date.parse(this.data.ep.entryTime.toString())) / 1000 / 3600 / 24);
  }

  selectEmp() {
    if(this.employees.length == 1){
      this.ExitPersonForm.controls['exitEmployee'].setValue(this.employees[0]);
      this.entEmp.closePanel();
    }
  }

  displayFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
  }

  onPaid(event){
    this.paid = !this.paid;
  }

  onSubmit() {
    var ee = this.ExitPersonForm.controls['exitEmployee'].value;
    this.billNumber = this.ExitPersonForm.controls['billNumber'].value;
    let exitPerson = {
      'id': this.data.ep.id,
      'exitGate': {
        'id': this.data.gid
      },
      'exitEmployee': {
        'id': ee.id
      },
      'paid': this.paid,
      'billNumber': this.billNumber
    }

    this.gatesService.postPersonExit(exitPerson)
      .subscribe((res) => {
          this.gatesService.getAllExpectedPersons()
            .subscribe((res: ExpectedPerson[]) => {
              this.dialogRef.close({id: this.data.ep.id, expectedPersons: res});
            })
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
