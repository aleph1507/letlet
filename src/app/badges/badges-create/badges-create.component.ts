import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckbox } from '@angular/material';
import { BadgesService } from '../../services/badges.service';
import { Badge } from '../../models/Badge.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourcesService } from '../../services/resources.service';
import { Employee } from '../../models/Employee';


@Component({
  selector: 'app-badges-create',
  templateUrl: './badges-create.component.html',
  styleUrls: ['./badges-create.component.css']
})
export class BadgesCreateComponent implements OnInit {

  badgeForm : FormGroup;
  badge : Badge = new Badge();
  employees : Employee[];
  returned : boolean = false;

  constructor(public dialogRef: MatDialogRef<BadgesCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Badge,
              private badgesService: BadgesService,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.badgeForm = this.createBadgeForm();
    this.resourcesService.employees.getAllEmployees()
      .subscribe((res : Employee[]) => {
        this.employees = res;
        this.badgeForm = this.createBadgeForm();

      });
  }

  onSubmit() {

  }

  displayFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname: undefined;
  }

  createBadgeForm() {
    return new FormGroup({
      'cardSeriesNumber': new FormControl(this.badge.cardSeriesNumber, {
        validators: Validators.required
      }),
      'cardNumber': new FormControl(this.badge.cardNumber, {
        validators: Validators.required
      }),
      'expireDate': new FormControl(this.badge.expireDate, {
        validators: Validators.required
      }),
      // 'active': new FormControl(this.badge.active, {
      //   validators: Validators.required
      // }),
      'returned': new FormControl(this.badge.returned, {
        // validators: Validators.required
      }),
      // 'employeeId': new FormControl(this.badge.employeeId, {
      //   validators: Validators.required
      // }),
      'employee': new FormControl(this.badge.employee, {
        validators: Validators.required
      }),
      // 'zones': new FormControl(this.badge.zones, {
      //   validators: Validators.required
      // }),
      'dateOfSecurityCheck': new FormControl(this.badge.dateOfSecurityCheck, {
        validators: Validators.required
      }),
      'dateOfTraining': new FormControl(this.badge.dateOfTraining, {
        validators: Validators.required
      }),
      'dateOfActivation': new FormControl(this.badge.dateOfActivation, {
        validators: Validators.required
      }),
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
