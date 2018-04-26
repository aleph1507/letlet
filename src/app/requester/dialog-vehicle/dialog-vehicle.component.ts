import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RequesterService } from '../../services/requester.service';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-dialog-vehicle',
  templateUrl: './dialog-vehicle.component.html',
  styleUrls: ['./dialog-vehicle.component.css']
})
export class DialogVehicleComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<DialogVehicleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {vehicle, i, resource},
              private requesterService: RequesterService,
              private resourcesService: ResourcesService
              ) { }

  resource: false;

  vehicleForm: FormGroup;
  vehicle: Vehicle = {
    company: '',
    model: '',
    plate: ''
  }

  ngOnInit() {

      if(this.data != null){
        if(this.data.vehicle != null)
          this.vehicle = this.data.vehicle;
      }

      this.resource = this.data.resource;

      this.vehicleForm = new FormGroup({
        'company': new FormControl(this.vehicle.company, {
          validators: Validators.required
        }),
        'model': new FormControl(this.vehicle.model, {
          validators: Validators.required
        }),
        'plate': new FormControl(this.vehicle.plate, {
          validators: Validators.required
        })
      })
  }

  onSubmit(){
    this.vehicle.company = this.vehicleForm.controls['company'].value;
    this.vehicle.model = this.vehicleForm.controls['model'].value;
    this.vehicle.plate = this.vehicleForm.controls['plate'].value;
    if(!this.data.resource){
      console.log('vo !resource this.data.resource: ', this.data.resource);
      console.log('vo !resource this.data: ', this.data);
      // console.log('pre add (vModal) requester.vehicles: ', this.requesterService.getAllVehicles());
      this.data.i == null ? this.requesterService.addVehicle(this.vehicle) : this.requesterService.editVehicle(this.data.i, this.vehicle);
      // console.log('post add (vModal) requester.vehicles: ', this.requesterService.getAllVehicles());
      // if(this.data.i !== null){
      //   this.requesterService.editVehicle(this.data.i, this.vehicle);
      // } else {
      //   this.requesterService.addVehicle(this.vehicle);
      // }
    } else {
      // console.log('vo resource this.data.resource: ', this.data.resource);
      // console.log('vo resource this.data: ', this.data);
      // console.log('pre add (vModal) resources.vehicles: ', this.resourcesService.vehicles.getAllVehicles());
      this.data.i == null ? this.resourcesService.vehicles.addVehicle(this.vehicle) : this.resourcesService.vehicles.editVehicle(this.data.i, this.vehicle);
      // console.log('post add (vModal) resources.vehicles: ', this.resourcesService.vehicles.getAllVehicles());
    }

    // console.log('prev call add vehicles(vehicleModal): ', this.requesterService.getAllVehicles());
    // this.data === null ? this.requesterService.addVehicle(this.vehicle) : this.requesterService.editVehicle(this.data.i, this.vehicle);
    // console.log('post call add vehicles(vehicleModal): ', this.requesterService.getAllVehicles());
    this.thisDialogRef.close(this.vehicle);
  }

  onCancel(){
    this.thisDialogRef.close("Cancel");
  }

  // okAble(){
  //   return this.personForm.controls['name'].status === "VALID" &&
  //     this.personForm.controls['surname'].status === "VALID" && this.img1src != ''
  //     && this.img2src != '';
  // }

}
