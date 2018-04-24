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
              @Inject(MAT_DIALOG_DATA) public data: {vehicle, i},
              private requesterService: RequesterService,
              private resourcesService: ResourcesService
              ) { }

  vehicleForm: FormGroup;
  vehicle: Vehicle = {
    model: '',
    plate: ''
  }

  ngOnInit() {

      if(this.data !== null){
        this.vehicle = this.data.vehicle;
      }

      this.vehicleForm = new FormGroup({
        'model': new FormControl(this.vehicle.model, {
          validators: Validators.required
        }),
        'plate': new FormControl(this.vehicle.plate, {
          validators: Validators.required
        })
      })
  }

  onSubmit(){
    this.vehicle.model = this.vehicleForm.controls['model'].value;
    this.vehicle.plate = this.vehicleForm.controls['plate'].value;
    console.log('prev call add vehicles: ', this.resourcesService.vehicles.getAllVehicles());
    this.data === null ? this.resourcesService.vehicles.addVehicle(this.vehicle) : this.resourcesService.vehicles.editVehicle(this.data.i, this.vehicle);
    console.log('post call add vehicles: ', this.resourcesService.vehicles.getAllVehicles());
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
