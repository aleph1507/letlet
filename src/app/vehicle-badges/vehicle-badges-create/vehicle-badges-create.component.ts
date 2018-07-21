import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleBadge } from '../../models/VehicleBadge';
import { resourceVehicle } from '../../models/resourceVehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VehicleBadgesService } from '../../services/vehicle-badges.service';
import { ResourcesService } from '../../services/resources.service';

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

  constructor(public dialogRef: MatDialogRef<VehicleBadgesCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VehicleBadge,
              private vehicleBadgeService: VehicleBadgesService,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    console.log('data: ', this.data);
    if(this.data != null){
      this.vehicleBadge = this.data;
      this.vehicleBadgeForm  = this.createVehicleBadgeForm();
      this.vehicleAutoCtrl.setValue(this.vehicleBadge.vehicle);
      this.vehicleBadge.return = this.vehicleBadge.return;
      this.vehicleBadgeForm.controls['return'].setValue(this.vehicleBadge.return);
      console.log('this.vehicleBadge: ', this.vehicleBadge);
    } else {
      this.vehicleBadgeForm = this.createVehicleBadgeForm();
    }

    this.vehicleAutoCtrl.valueChanges
      .subscribe(d => {
        this.resourcesService.vehicles.filterVehicles(d)
          .subscribe((data: resourceVehicle[]) => {
            console.log('resourceVehicle: ', data);
            this.vehicles_auto = data;
          });
      });
  }

  onSubmit() {
    let dExpire = new Date(this.vehicleBadgeForm.controls['expireDate'].value);
    let dShredding = new Date(this.vehicleBadgeForm.controls['shreddingDate'].value);
    this.vehicleBadge.id = this.data == null ? null : this.data.id;
    this.vehicleBadge.permitNumber = this.vehicleBadgeForm.controls['permitNumber'].value;
    this.vehicleBadge.return = this.returned;
    this.vehicleBadge.expireDate = this.parseDate(dExpire);
    this.vehicleBadge.vehicle = this.vehicleAutoCtrl.value;
    this.vehicleBadge.shreddigDate = this.parseDate(dShredding);
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

  parseDate(dE: Date){
    let parsedDE = dE.getFullYear() + '-';
    dE.getMonth() < 10 ? parsedDE += '0' + dE.getMonth() : parsedDE += dE.getMonth();
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
      'return': new FormControl(this.vehicleBadge.return, {

      }),
      'expireDate': new FormControl(this.vehicleBadge.expireDate, {
        validators: [Validators.required]
      }),
      'shreddingDate': new FormControl(this.vehicleBadge.shreddigDate, {
        // validators: [Validators.required]
      })
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
