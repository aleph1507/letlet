import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExpectedVehicle } from '../../../models/ExpectedVehicle.model';
import { ResourcesService } from '../../../services/resources.service';
import { GatesService } from '../../../services/gates.service';
import { Employee } from '../../../models/Employee';
import { VisitorVehicleBadge } from '../../../models/VisitorVehicleBadge';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company } from '../../../models/Company';
import { EnteredVehicle } from '../../../models/EnteredVehicle.model';

@Component({
  selector: 'app-enter-vehicle-modal',
  templateUrl: './enter-vehicle-modal.component.html',
  styleUrls: ['./enter-vehicle-modal.component.css']
})
export class EnterVehicleModalComponent implements OnInit {

  employees : Employee[] = [];
  visitorVehicleBadges : VisitorVehicleBadge[] = [];
  gid: number;
  EnterVehicleForm : FormGroup = null;
  companies : Company[] = [];

  constructor(private dialogRef: MatDialogRef<EnterVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {gid: number, exv: ExpectedVehicle },
              private resourceService: ResourcesService,
              private gatesService: GatesService) { }

  ngOnInit() {
    this.resourceService.employees.getAllEmployees()
      .subscribe((emps: Employee[]) => {
        this.employees = emps;
        this.resourceService.visitorVehicleBadges.getAllVisitorVehicleBadges()
          .subscribe((vvbs : VisitorVehicleBadge[]) => {
              this.resourceService.companies.getCompanies()
                .subscribe((comps : Company[]) => {
                    this.companies = comps;
                    this.visitorVehicleBadges = vvbs;
                    this.EnterVehicleForm = new FormGroup({
                      'company': new FormControl('',{
                        validators: [Validators.required],
                        updateOn: 'change'
                      }),
                      'entryEmployee': new FormControl('',{
                        validators: [Validators.required],
                        updateOn: 'change'
                      }),
                      'visitorVehicleBadge': new FormControl('', {
                        validators: [Validators.required],
                        updateOn: 'change'
                      })
                });

            });
          });
      });
  }

  displayFnCompany(c?: Company) {
    return c ? c.name : undefined;
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
    let comp = this.EnterVehicleForm.controls['company'].value;
    let eVehicle = {
      'company': {
        'id': comp.id
      },
      'vehicle': {
        'id': this.data.exv.requestId
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
        console.log('res: ' + res);
        this.gatesService.getAllEnteredVehicles()
          .subscribe((data: EnteredVehicle[]) => {
            this.dialogRef.close({vehicleId: this.data.exv.requestId, vehiclesInside: data});
          })
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
