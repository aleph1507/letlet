import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckbox, MatDialog } from '@angular/material';
import { BadgesService } from '../../services/badges.service';
import { Badge } from '../../models/Badge.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourcesService } from '../../services/resources.service';
import { Employee } from '../../models/Employee';
import { AirportZone } from '../../models/AirportZone';
import { lengthValidator } from '../../customValidators/lengthValidator.directive';
import { SnackbarService } from '../../services/snackbar.service';

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
  employeeAutoCtrl: FormControl = new FormControl();
  employees_auto: Employee[] = [];
  do_patch = true;
  deactivated: boolean = false;
  deactivateReason: string = '';

  constructor(public dialogRef: MatDialogRef<BadgesCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Badge,
              private badgesService: BadgesService,
              private resourcesService: ResourcesService,
              public confirmDialog: MatDialog,
              public snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data != null){
      this.badge = this.data;
      this.returned = this.data.returned;
      this.deactivated = this.data.deactivated ? this.data.deactivated : false;
    }

    this.badgeForm = this.createBadgeForm();

      this.badgeForm.controls['employee'].valueChanges
        .subscribe(d => {
          this.resourcesService.employees.filterEmployees(d)
            .subscribe((data: Employee[]) => {
              this.employees_auto = data;
            });
        })
    this.resourcesService.airportZones.getAllAirportZones()
      .subscribe((resZones : AirportZone[]) => {
        this.zones = resZones;
        this.nZones = this.zones.length;
        if(this.data != null){
          for(let i = 0; i<this.badge.zones.length; i++){
            this.zonesBool[this.badge.zones[i].zone.code-1] = true;
          }
        }
      });
  }

  checkZone(i){
    this.zonesBool[i] = !this.zonesBool[i];
  }

  parseDate(dE: Date){
    let parsedDE = dE.getFullYear() + '-';
    console.log('dE.getMonth(): ', dE.getMonth());
    dE.getMonth() < 9 ? parsedDE += '0' + (+dE.getMonth()+1).toString() : parsedDE += (+dE.getMonth()+1).toString();
    dE.getDate() < 10 ? parsedDE += '-0' + dE.getDate() : parsedDE += '-' + dE.getDate();
    return parsedDE;
  }

  onSubmit() {
    if(!this.do_patch)
      return;
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
    this.badge.badgeNumber = this.badgeForm.controls['badgeNumber'].value;
    this.badge.zones = addedZones;
    this.badge.payment = this.badgeForm.controls['payment'].value;
    if(this.data == null){
      this.badgesService.addBadge(this.badge)
        .subscribe((data : Badge) => {
          this.badgesService.pushBadge(data);
          this.dialogRef.close();
        });
    } else {
      this.badgesService.editBadge(this.badge, this.badge.id)
        .subscribe((data: Badge) => {
          this.badgesService.pushBadge(data);
          this.dialogRef.close();
        })
    }
  }

  displayFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname: undefined;
  }

  displayEmpFn(e?: Employee) {
    return e ? e.name + ' ' + e.surname : undefined;
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  createBadgeForm() {
    return new FormGroup({
      'cardSeriesNumber': new FormControl(this.badge.cardSeriesNumber, {
        validators: [Validators.required]
                    // lengthValidator(3)]
      }),
      'cardNumber': new FormControl(this.badge.cardNumber, {
        validators: [Validators.required]
                      // lengthValidator(5)]
      }),
      'expireDate': new FormControl(this.badge.expireDate, {
        validators: Validators.required
      }),
      'badgeNumber': new FormControl(this.badge.badgeNumber, {
        validators: [Validators.required,
                      lengthValidator(4)]
      }),
      'returned': new FormControl(this.badge.returned, {

      }),
      'employee': new FormControl(this.badge.employee, {
        validators: Validators.required
      }),
      'dateOfSecurityCheck': new FormControl(this.badge.dateOfSecurityCheck, {
        validators: Validators.required
      }),
      'dateOfTraining': new FormControl(this.badge.dateOfTraining, {
        validators: Validators.required
      }),
      'dateOfActivation': new FormControl(this.badge.dateOfActivation, {
        validators: Validators.required
      }),
      'payment': new FormControl(this.badge.payment)
    })
  }

  shredConfirm(id: number) {
    this.do_patch = false;
    let cShred = confirm('Are you sure?');
    if(cShred){
      this.badgesService.shredBadge(id)
        .subscribe(d => {
        });
      this.dialogRef.close();
    }
  }

  deactivate(id) {
    this.deactivateReason = prompt('Please enter the deactivation reason:');
    if(this.deactivateReason == null || this.deactivateReason == ''){
      // console.log('deactivate canceled');
    } else {
      this.badgesService.deactivate(this.badge.id, this.deactivateReason)
        .subscribe(data => {
          if(data){
            this.badge.deactivated = true;
            this.deactivated = true;
            this.snackbarService.successSnackBar("Successfully deactivated");
          } else {
            this.snackbarService.failSnackBar("Deactivation error");
          }
        });
    }
  }

  activate(id){
    let confirmActivate = confirm('Are you sure you want to activate the badge?');
    if(confirmActivate){
      this.badgesService.activate(id)
        .subscribe(data => {
          if(data){
            this.badge.deactivated = false;
            this.deactivated = false;
            this.deactivateReason = '';
            this.snackbarService.successSnackBar("Successfully activated");
          } else {
            this.snackbarService.failSnackBar("Activation error");
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
