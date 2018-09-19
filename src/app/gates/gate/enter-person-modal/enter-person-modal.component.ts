import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { ExpectedPerson } from '../../../models/ExpectedPerson.model';
import { ResourcesService } from '../../../services/resources.service';
import { Employee } from '../../../models/Employee';
import { VisitorBadge } from '../../../models/VisitorBadge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GatesService } from '../../../services/gates.service';
import { EnteredPerson } from '../../../models/EnteredPerson.model';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-enter-person-modal',
  templateUrl: './enter-person-modal.component.html',
  styleUrls: ['./enter-person-modal.component.css']
})
export class EnterPersonModalComponent implements OnInit {

  employees : Employee[] = [];
  visitorBadges : VisitorBadge[] = [];
  gid: number;
  EnterPersonForm : FormGroup = new FormGroup({
    'entryEmployee': new FormControl('', {
      validators: [Validators.required],
      updateOn: 'change'
    }),
    'visitorBadge': new FormControl('', {
      validators: [Validators.required],
      updateOn: 'change'
    })
  });

  @ViewChild(MatAutocompleteTrigger) entEmp: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) vBadge: MatAutocompleteTrigger;

  @ViewChild('empInput') empInput: ElementRef;
  @ViewChild('VBInput') VBInput: ElementRef;
  @ViewChild('sBtn') sBtn: ElementRef;


  filteredVBs: VisitorBadge[];

  constructor(private dialogRef: MatDialogRef<EnterPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {gid: number, ep: ExpectedPerson },
              private resourceService: ResourcesService,
              private gatesService: GatesService) { }

  ngOnInit() {
    this.resourceService.visitorBadges.getAllVisitorBadges()
      .subscribe((vbs: VisitorBadge[]) => {
        this.visitorBadges = vbs;
      });

    this.EnterPersonForm.controls['entryEmployee'].valueChanges
      .subscribe(d => {
        if(d === ''){
          this.employees = [];
        }
      });

    this.EnterPersonForm.controls['entryEmployee'].valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(d => {
         if(typeof d == 'string' && d != ''){
          this.resourceService.employees.filterEntryEmployees(d)
          .subscribe((data: Employee[]) => {
            this.employees = data;
            if(data.length == 1){
              this.selectEmp();
              this.VBInput.nativeElement.focus();
            }
          });
        }
      });

      this.EnterPersonForm.controls['visitorBadge'].valueChanges
        // .debounceTime(400)
        .distinctUntilChanged()
        .pipe(
        startWith<string | VisitorBadge>(),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterVBs(name) : this.visitorBadges.slice())
      ).subscribe(data =>{
        this.filteredVBs = data;
        if(this.filteredVBs.length == 1){
            this.EnterPersonForm.controls['visitorBadge'].setValue(this.filteredVBs[0]);
            this.empInput.nativeElement.focus();
            this.vBadge.closePanel();
        }
      });
  }

  selectEmp() {
    if(this.employees.length == 1){
      this.EnterPersonForm.controls['entryEmployee'].setValue(this.employees[0]);
      this.entEmp.closePanel();
    }
  }

  private _filterVBs(name: string): VisitorBadge[] {
    const filterValue = name.toLowerCase();

    return this.visitorBadges.filter(vb => vb.barcode.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(e?: Employee) {
    return e ? e.name : undefined;
  }

  displayFnVB(vb?: VisitorBadge) {
    return vb ? vb.barcode : undefined;
  }

  displayEmpFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
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
