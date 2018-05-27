import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { resourceVehicle } from '../../../models/resourceVehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RequesterService } from '../../../services/requester.service';
import { ResourcesService } from '../../../services/resources.service';
import { Company } from '../../../models/Company';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-dialog-vehicle',
  templateUrl: './dialog-vehicle.component.html',
  styleUrls: ['./dialog-vehicle.component.css']
})
export class DialogResourceVehicleComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<DialogResourceVehicleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private requesterService: RequesterService,
              private resourcesService: ResourcesService
              ) { }

  resource: false;

  vehicleForm: FormGroup;
  vehicle: resourceVehicle = {
    id: null,
    company: null,
    model: null,
    plate: null
  }

  companies: Company[];

  ngOnInit() {

      this.resourcesService.companies.getCompanies()
        .subscribe((data) => {
          this.companies = data;
        });

      this.vehicleForm = new FormGroup({
        'company': new FormControl(this.vehicle.company ? this.vehicle.company : '', {
          validators: Validators.required
        }),
        'model': new FormControl(this.vehicle.model, {
          validators: Validators.required
        }),
        'plate': new FormControl(this.vehicle.plate, {
          validators: Validators.required
        })
      })

      if(this.data != null){
        this.resourcesService.vehicles.getVehicleByIndex(this.data)
          .subscribe((res : resourceVehicle) => {
            this.vehicle = res;
            this.vehicleForm = new FormGroup({
              'company': new FormControl(this.vehicle.company ? this.vehicle.company : '', {
                validators: Validators.required
              }),
              'model': new FormControl(this.vehicle.model, {
                validators: Validators.required
              }),
              'plate': new FormControl(this.vehicle.plate, {
                validators: Validators.required
              })
            })
          })
      }

      // if(this.data != null){
      //   if(this.data.vehicle != null)
      //     this.vehicle = this.data.vehicle;
      // }
      //
      // this.resource = this.data.resource;


  }

  displayFn(c?: Company) {
    return c ? c.name : undefined;
  }

  onSubmit(){
    this.vehicle.company = this.vehicleForm.controls['company'].value;
    this.vehicle.model = this.vehicleForm.controls['model'].value;
    this.vehicle.plate = this.vehicleForm.controls['plate'].value;

      this.data == null ?
        this.resourcesService.vehicles.addVehicle(this.vehicle)
          .subscribe((data) => {
            console.log('data: ' + data);
            this.resourcesService.vehicles.pushVehicle(data)
          }) : this.resourcesService.vehicles.editVehicle(this.vehicle)
                .subscribe((data : resourceVehicle) => {
                  this.resourcesService.vehicles.switchVehicleById(this.vehicle)
                });
      // console.log('post add (vModal) resources.vehicles: ', this.resourcesService.vehicles.getAllVehicles());

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
