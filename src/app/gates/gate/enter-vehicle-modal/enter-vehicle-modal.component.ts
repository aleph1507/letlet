import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { ExpectedVehicle } from '../../../models/ExpectedVehicle.model';
import { ResourcesService } from '../../../services/resources.service';
import { GatesService } from '../../../services/gates.service';
import { Employee } from '../../../models/Employee';
import { VisitorVehicleBadge } from '../../../models/VisitorVehicleBadge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company } from '../../../models/Company';
import { EnteredVehicle } from '../../../models/EnteredVehicle.model';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-enter-vehicle-modal',
  templateUrl: './enter-vehicle-modal.component.html',
  styleUrls: ['./enter-vehicle-modal.component.css']
})
export class EnterVehicleModalComponent implements OnInit {

  employees : Employee[] = [];
  visitorVehicleBadges : VisitorVehicleBadge[] = [];
  gid: number;
  EnterVehicleForm : FormGroup = new FormGroup({
    'entryEmployee': new FormControl('',{
      validators: [Validators.required],
      updateOn: 'change'
    }),
    'visitorVehicleBadge': new FormControl('', {
      validators: [Validators.required],
      updateOn: 'change'
    })
});;
  companies : Company[] = [];

   @ViewChild('vvBadge') vvBadgeAutoComplete: MatAutocomplete;
   @ViewChild(MatAutocompleteTrigger) entEmp: MatAutocompleteTrigger;

  filteredVVBs: VisitorVehicleBadge[];

  constructor(private dialogRef: MatDialogRef<EnterVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {gid: number, exv: ExpectedVehicle },
              private resourceService: ResourcesService,
              private gatesService: GatesService) { }

  chooseFirstOption(): void {
    if((this.vvBadgeAutoComplete.options.first != undefined) &&
        (this.vvBadgeAutoComplete.options.first != null))
          this.vvBadgeAutoComplete.options.first.select();
  }

  ngOnInit() {
    this.resourceService.visitorVehicleBadges.getAllVisitorVehicleBadges()
      .subscribe((vvbs : VisitorVehicleBadge[]) => {
          this.visitorVehicleBadges = vvbs;
          // this.resourceService.companies.getCompanies()
          //   .subscribe((comps : Company[]) => {
          //       this.companies = comps;
          //   });
        });

    this.EnterVehicleForm.controls['entryEmployee'].valueChanges
      .subscribe(d => {
        if(d === ''){
          this.employees = [];
        }
      });

    this.EnterVehicleForm.controls['entryEmployee'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(d => {
        if(d === ''){
          this.employees = [];
        } else if(typeof d == 'string' && d != ''){
          this.resourceService.employees.filterEntryEmployees(d)
          .subscribe((data: Employee[]) => {
            this.employees = data;
            if(data.length == 1){
              this.selectEmp();
            }
          });
        }
      });

      this.EnterVehicleForm.controls['visitorVehicleBadge'].valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .pipe(
        startWith<string | VisitorVehicleBadge>(),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterVVBs(name) : this.visitorVehicleBadges.slice())
      ).subscribe(data => {
        this.filteredVVBs = data;
        if(data.length == 1){
          this.EnterVehicleForm.controls['visitorVehicleBadge'].setValue(this.filteredVVBs[0]);
        }
      });
  }

  private _filterVVBs(name: string): VisitorVehicleBadge[] {
    const filterValue = name.toLowerCase();

    return this.visitorVehicleBadges.filter(vb => vb.code.toString().toLowerCase().indexOf(filterValue) === 0);
  }

  selectEmp() {
    if(this.employees.length == 1){
      this.EnterVehicleForm.controls['entryEmployee'].setValue(this.employees[0]);
      this.entEmp.closePanel();
    }
  }

  displayFnCompany(c?: Company) {
    return c ? c.name : undefined;
  }

  displayEmpFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
  }

  displayFnEmployee(e?: Employee) {
    return e ? e.name : undefined;
  }

  displayFnVB(vvb?: VisitorVehicleBadge) {
    return vvb ? vvb.code + ' ' + vvb.name : undefined;
  }

  onSubmit() {
    let vvb = this.EnterVehicleForm.controls['visitorVehicleBadge'].value;
    let ee = this.EnterVehicleForm.controls['entryEmployee'].value;
    let eVehicle = {
      'company': {
        'id': this.data.exv.companyId
      },
      'vehicle': {
        'id': this.data.exv.vehicleRequestId
      },
      'visitorVehicleBadge': {
        'id': vvb.id
      },
      'entryGate': {
        'id': this.data.gid
      },
      'entryEmployee': {
        'id': ee.id
      }
    }

    this.gatesService.postVehicleEnter(eVehicle)
      .subscribe((res) => {
        this.gatesService.getAllEnteredVehicles()
          .subscribe((data: EnteredVehicle[]) => {
            this.dialogRef.close({vehicleId: this.data.exv.vehicleRequestId, vehiclesInside: data});
          })
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
