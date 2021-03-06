import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleBadge } from '../../models/VehicleBadge';
import { resourceVehicle } from '../../models/resourceVehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VehicleBadgesService } from '../../services/vehicle-badges.service';
import { ResourcesService } from '../../services/resources.service';
import { Vehicle } from '../../models/Vehicle.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-vehicle-badges-create',
  templateUrl: './vehicle-badges-create.component.html',
  styleUrls: ['./vehicle-badges-create.component.css']
})
export class VehicleBadgesCreateComponent implements OnInit {

  vehicleBadge: VehicleBadge = new VehicleBadge();
  vehicle: resourceVehicle;
  returned: boolean = false;
  id = null;
  vehicleAutoCtrl: FormControl = new FormControl();
  vehicles_auto: resourceVehicle[] = [];
  vehicleBadgeForm: FormGroup;
  do_patch = true;
  deactivated : boolean = false;
  deactivateReason : string = '';

  constructor(public dialogRef: MatDialogRef<VehicleBadgesCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VehicleBadge,
              private vehicleBadgeService: VehicleBadgesService,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data != null){
      this.vehicleBadge = this.data;
      this.vehicleBadge.returned = this.data.returned;
      this.returned = this.data.returned;
      this.vehicleBadgeForm  = this.createVehicleBadgeForm();
      this.vehicleAutoCtrl.setValue(this.vehicleBadge.vehicle);
      this.vehicleBadge.returned = this.vehicleBadge.returned;
      this.vehicleBadgeForm.controls['return'].setValue(this.vehicleBadge.returned);
    } else {
      this.vehicleBadgeForm = this.createVehicleBadgeForm();
    }

    this.vehicleAutoCtrl.valueChanges
      .subscribe(d => {
        this.resourcesService.vehicles.filterResVehicles(d)
          .subscribe((data: resourceVehicle[]) => {
            this.vehicles_auto = data;
          });
      });
  }

  onSubmit() {
    if(!this.do_patch)
      return;
    let dExpire = new Date(this.vehicleBadgeForm.controls['expireDate'].value);
    this.vehicleBadge.id = this.data == null ? null : this.data.id;
    this.vehicleBadge.permitNumber = this.vehicleBadgeForm.controls['permitNumber'].value;
    this.vehicleBadge.returned = this.returned;
    this.vehicleBadge.expireDate = this.parseDate(dExpire);
    this.vehicleBadge.vehicle = this.vehicleAutoCtrl.value;
    this.vehicleBadge.payment = this.vehicleBadgeForm.controls['payment'].value;
    if(this.data == null)
      this.vehicleBadge.shreddigDate = null;
    if(this.data == null) {
      this.vehicleBadgeService.addVehicleBadge(this.vehicleBadge)
        .subscribe((data: VehicleBadge) => {
          this.vehicleBadgeService.pushVehicleBadge(data);
          this.dialogRef.close();
        });
    } else {
      this.vehicleBadgeService.editVehicleBadge(this.vehicleBadge, this.vehicleBadge.id)
        .subscribe((data: VehicleBadge) => {
          this.vehicleBadgeService.pushVehicleBadge(data);
          this.dialogRef.close();
        });
    }
  }

  deactivate(id){
    this.deactivateReason = prompt('Please enter the deactivation reason:');
    if(this.deactivateReason == null || this.deactivateReason == ''){
      // console.log('deactivate canceled');
    } else {
      this.vehicleBadgeService.deactivate(id, this.deactivateReason)
        .subscribe(data => {
          if(data) {
            this.vehicleBadge.deactivated = true;
            this.snackbarService.successSnackBar("Successfully deactivated");
          } else {
            this.snackbarService.failSnackBar("Deactivation error");
          }
        });
    }
  }

  activate(id){
    let confirmActivate = confirm('Are you sure you want to activate the vehicle\'s badge?');
    if(confirmActivate){
      this.vehicleBadgeService.activate(id)
        .subscribe(data => {
          if(data){
            this.vehicleBadge.deactivated = false;
            this.deactivated = false;
            this.deactivateReason = '';
            this.snackbarService.successSnackBar("Successfully activated");
          } else {
            this.snackbarService.failSnackBar("Activation error");
          }
        });
    }
  }

  parseDate(dE: Date){
    let parsedDE = dE.getFullYear() + '-';
    dE.getMonth() < 9 ? parsedDE += '0' + (+dE.getMonth()+1).toString() : parsedDE += (+dE.getMonth()+1).toString();
    dE.getDate() < 10 ? parsedDE += '-0' + dE.getDate() : parsedDE += '-' + dE.getDate();
    return parsedDE;
  }

  displayFn(v?: resourceVehicle) {
    return v ? v.model + ' ' + v.plate : '';
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  createVehicleBadgeForm() {
    return new FormGroup({
      'permitNumber': new FormControl(this.vehicleBadge.permitNumber, {
        validators: [Validators.required]
      }),
      'return': new FormControl({value: this.vehicleBadge.returned}, {

      }),
      'expireDate': new FormControl(this.vehicleBadge.expireDate, {
        validators: [Validators.required]
      }),
      'payment': new FormControl(this.vehicleBadge.payment, {

      })
    })
  }

  shredConfirm(id: number) {
    this.do_patch = false;
    let cShred = confirm('Are you sure?');
    if(cShred){
      this.vehicleBadgeService.shredVehicleBadge(id)
        .subscribe(d => {
          // console.log(`Vehicle Badge id: ${id} shredded, d: `, d);
        });
      this.dialogRef.close();
      }
   }

  onCancel(): void {
    this.dialogRef.close();
  }

}
