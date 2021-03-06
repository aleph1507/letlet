import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../../models/Vehicle.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RequesterService } from '../../services/requester.service';
import { ResourcesService } from '../../services/resources.service';
import { Company } from '../../models/Company';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-dialog-vehicle',
  templateUrl: './dialog-vehicle.component.html',
  styleUrls: ['./dialog-vehicle.component.css']
})
export class DialogVehicleComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<DialogVehicleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {vehicle, i, resource},
              private requesterService: RequesterService,
              private resourcesService: ResourcesService,
              private cd: ChangeDetectorRef
              ) { }

  resource: false;

  img1src: string ='';
  img2src: string = '';

  vehicleForm: FormGroup;
  vehicle: Vehicle = {
    model: null,
    plate: null,
    // image1: null,
    // image2: null
  }

  ngOnInit() {
      if(this.data != null){
        if(this.data.vehicle != null){
          this.vehicle = this.data.vehicle;
          this.img1src = this.data.vehicle.image1;
          this.img2src = this.data.vehicle.image2;
        }
      }

      this.resource = this.data.resource;

      this.vehicleForm = new FormGroup({
        'model': new FormControl(this.vehicle.model, {
          validators: Validators.required
        }),
        'plate': new FormControl(this.vehicle.plate, {
          validators: Validators.required
        }),
        'image1': new FormControl(null),
        'image2': new FormControl(null)
      })
  }

  previewImage(event){
    let elem = event.target || event.srcElement || event.currentTarget;
    if(elem.files.length > 0){
      let reader = new FileReader();
      reader.onload = (event:any) => {
        if(elem.attributes.formcontrolname.value == "image1")
          this.img1src = event.target.result;
        else
          this.img2src = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.cd.markForCheck();
    }
  }

  onSubmit(){
    this.vehicle.model = this.vehicleForm.controls['model'].value;
    this.vehicle.plate = this.vehicleForm.controls['plate'].value;
    // this.vehicle.image1 = this.img1src;
    // this.vehicle.image2 = this.img2src;
    if(!this.data.resource){
      this.data.i == null ? this.requesterService.addVehicle(this.vehicle) : this.requesterService.editVehicle(this.data.i, this.vehicle);
    }
    this.thisDialogRef.close(this.vehicle);
  }

  onCancel(){
    this.thisDialogRef.close("Cancel");
  }
}
