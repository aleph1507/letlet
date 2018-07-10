import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckbox } from '@angular/material';
import { BadgesService } from '../../services/badges.service';
import { Badge } from '../../models/Badge.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourcesService } from '../../services/resources.service';
import { Employee } from '../../models/Employee';
import { AirportZone } from '../../models/AirportZone';
import { lengthValidator } from '../../customValidators/lengthValidator.directive';


@Component({
  selector: 'app-badges-create',
  templateUrl: './badges-create.component.html',
  styleUrls: ['./badges-create.component.css']
})
export class BadgesCreateComponent implements OnInit {

  badgeForm : FormGroup;
  badge : Badge = new Badge();
  employees : Employee[];
  zonesBool : boolean[] = new Array<boolean>();
  nZones : number;
  zones : AirportZone[];
  returned : boolean = false;
  id = null;

  constructor(public dialogRef: MatDialogRef<BadgesCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Badge,
              private badgesService: BadgesService,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data != null){
      this.badge = this.data;
      console.log('this.badge.expireDate: ' + this.badge.expireDate);
    }

    this.badgeForm = this.createBadgeForm();
    this.resourcesService.employees.getAllEmployees()
      .subscribe((res : Employee[]) => {
        this.employees = res;
        this.badgeForm = this.createBadgeForm();
      });
    this.resourcesService.airportZones.getAllAirportZones()
      .subscribe((resZones : AirportZone[]) => {
        this.zones = resZones;
        this.nZones = this.zones.length;
        if(this.data != null){
          for(let i = 0; i<this.badge.zones.length; i++){
            this.zonesBool[this.badge.zones[i].id] = true;
          }
        }
      });
  }

  checkZone(i){
    // console.log('z.isChecked: ' + z.checked + ' ,  i : ' + i);
    this.zonesBool[i] = !this.zonesBool[i];
    // console.log(`this.zonesBool[i] : ${this.zonesBool[i]} || i : ${i}`)
  }

  parseDate(dE: Date){
    let parsedDE = dE.getFullYear() + '-';
    dE.getMonth() < 10 ? parsedDE += '0' + dE.getMonth() : parsedDE += dE.getMonth();
    dE.getDate() < 10 ? parsedDE += '-0' + dE.getDate() : parsedDE += '-' + dE.getDate();
    return parsedDE;
  }

  validateLength(c: FormControl, l: number){
    let n = c.value;
    return n.length == l ? null : {
      validateLength: {
        valid: false
      }}
  }

  onSubmit() {
    var addedZones : AirportZone[] = [];
    for(let i = 0; i<this.nZones; i++){
      if(this.zonesBool[i] == true){
        addedZones.push(this.zones[i]);
      }
    }
    let dExpire = new Date(this.badgeForm.controls['expireDate'].value);
    let dTraining = new Date(this.badgeForm.controls['dateOfTraining'].value);
    let dSecurity = new Date(this.badgeForm.controls['dateOfSecurityCheck'].value);
    let dActivation = new Date(this.badgeForm.controls['dateOfActivation'].value);
    this.badge.id = this.data == null ? null : this.data.id;
    this.badge.returned = this.returned;
    this.badge.expireDate = this.parseDate(dExpire);
    this.badge.employee = this.badgeForm.controls['employee'].value;
    this.badge.dateOfTraining = this.parseDate(dTraining);
    this.badge.dateOfSecurityCheck = this.parseDate(dSecurity);
    this.badge.dateOfActivation = this.parseDate(dActivation);
    this.badge.cardSeriesNumber = this.badgeForm.controls['cardSeriesNumber'].value;
    this.badge.cardNumber = this.badgeForm.controls['cardNumber'].value;
    this.badge.zones = addedZones;
    console.log('this.data: ', this.data);
    console.log('this.badge: ' + this.badge);
    if(this.data == null){
      this.badgesService.addBadge(this.badge)
        .subscribe((data : Badge) => {
          console.log('vo addBadge subscription data: ' + data);
          this.badgesService.pushBadge(data);
          this.dialogRef.close();
        });
    } else {
      this.badgesService.editBadge(this.badge, this.badge.id)
        .subscribe((data: Badge) => {
          console.log('vo editBadge subscribe data: ' + data);
          this.badgesService.pushBadge(data);
          this.dialogRef.close();
        })
    }
      // this.dialogRef.close();
  }

  displayFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname: undefined;
  }

  createBadgeForm() {
    return new FormGroup({
      'cardSeriesNumber': new FormControl(this.badge.cardSeriesNumber, {
        validators: [Validators.required,
                    lengthValidator(3)]
      }),
      'cardNumber': new FormControl(this.badge.cardNumber, {
        validators: [Validators.required,
                      lengthValidator(5)]
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
