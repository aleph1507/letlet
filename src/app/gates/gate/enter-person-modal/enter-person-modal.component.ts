import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExpectedPerson } from '../../../models/ExpectedPerson.model';
import { ResourcesService } from '../../../services/resources.service';
import { Employee } from '../../../models/Employee';
import { VisitorBadge } from '../../../models/VisitorBadge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GatesService } from '../../../services/gates.service';
import { EnteredPerson } from '../../../models/EnteredPerson.model';

@Component({
  selector: 'app-enter-person-modal',
  templateUrl: './enter-person-modal.component.html',
  styleUrls: ['./enter-person-modal.component.css']
})
export class EnterPersonModalComponent implements OnInit {

  employees : Employee[] = [];
  visitorBadges : VisitorBadge[] = [];
  gid: number;
  EnterPersonForm : FormGroup = null;

  constructor(private dialogRef: MatDialogRef<EnterPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {gid: number, ep: ExpectedPerson },
              private resourceService: ResourcesService,
              private gatesService: GatesService) { }

  ngOnInit() {
    this.resourceService.employees.getAllEmployees()
      .subscribe((emps: Employee[]) => {
        this.employees = emps;
        this.resourceService.visitorBadges.getAllVisitorBadges()
          .subscribe((vbs : VisitorBadge[]) => {
            this.visitorBadges = vbs;
            this.EnterPersonForm = new FormGroup({
              'entryEmployee': new FormControl('',{
                validators: [Validators.required],
                updateOn: 'change'
              }),
              'visitorBadge': new FormControl('', {
                validators: [Validators.required],
                updateOn: 'change'
              })
            });
          });
      });
      // this.gid = this.data.gid;
  }

  displayFn(e?: Employee) {
    return e ? e.name : undefined;
  }

  displayFnVB(vb?: VisitorBadge) {
    return vb ? vb.barcode + ' ' + vb.code : undefined;
  }

  onSubmit() {
    let vb = this.EnterPersonForm.controls['visitorBadge'].value;
    let ee = this.EnterPersonForm.controls['entryEmployee'].value;
    let ePerson = {
      'company': {
        'id': this.data.ep.companyId
      },
      'person': {
        'id': this.data.ep.requestPersonId
      },
      'visitorBadge': {
        'id': vb.id
      },
      'entryGate': {
        'id': this.data.gid
      },
      'entryEmployee': {
        'id': ee.id
      }
    }

    this.gatesService.postPersonEnter(ePerson)
      .subscribe((res : boolean) => {
        this.gatesService.getAllEnteredPersons()
          .subscribe((data : EnteredPerson[]) =>{
            this.dialogRef.close({personId: this.data.ep.requestPersonId, personsInside: data});
          });
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
