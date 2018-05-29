import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  billNumber : string = null;
  ExitPersonForm : FormGroup = null;

  constructor(private dialogRef: MatDialogRef<ExitPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { ep: EnteredPerson, gid: number },
              private resourcesService : ResourcesService,
              private gatesService : GatesService) { }

  ngOnInit() {
    this.resourcesService.employees.getAllEmployees()
      .subscribe((emps : Employee[]) => {
        this.employees = emps;
      });

    this.ExitPersonForm = new FormGroup({
      'exitEmployee': new FormControl('',{
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'paid': new FormControl(''),
      'billNumber': new FormControl('', {
        updateOn: 'change'
      })
    });
  }

  displayFn(e?: Employee) {
    return e ? e.name : undefined;
  }

  onPaid(event){
    this.paid = !this.paid;
    console.log('this.paid: ' + this.paid);
  }

  onSubmit() {
    console.log('this.data.ep: ' + this.data.ep);
    var ee = this.ExitPersonForm.controls['exitEmployee'].value;
    // if((this.ExitPersonForm.controls['billNumber'] != undefined))
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
        console.log('res: ' + res);
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
