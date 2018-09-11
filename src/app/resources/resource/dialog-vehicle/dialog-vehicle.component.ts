import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { resourceVehicle } from '../../../models/resourceVehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RequesterService } from '../../../services/requester.service';
import { ResourcesService } from '../../../services/resources.service';
import { Company } from '../../../models/Company';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-dialog-vehicle',
  templateUrl: './dialog-vehicle.component.html',
  styleUrls: ['./dialog-vehicle.component.css']
})
export class DialogResourceVehicleComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<DialogResourceVehicleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private requesterService: RequesterService,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService
              ) { }

  resource: false;

  vehicleForm: FormGroup;
  vehicle: resourceVehicle = {
    id: null,
    company: null,
    model: null,
    plate: null
  }

  companiesAutoCtrl: FormControl = new FormControl();
  companies_auto: Company[] = [];

  companyOk: boolean = this.companiesAutoCtrl.value == null ? false :
    (this.companiesAutoCtrl.value.id == undefined ? false : true);

  companies: Company[];

  ngOnInit() {
      this.companiesAutoCtrl.valueChanges
        .subscribe(d => {
          this.resourcesService.companies.filterCompanies(d)
            .subscribe((data:Company[]) => {
              console.log('company: ', data);
              this.companies_auto = data;
              this.companyOk = this.companiesAutoCtrl.value == null ? false :
                (this.companiesAutoCtrl.value.id == undefined ? false : true);
            });
        });

      this.vehicleForm = new FormGroup({
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
            this.companiesAutoCtrl.setValue(res.company);
            this.vehicleForm = new FormGroup({
              'model': new FormControl(this.vehicle.model, {
                validators: Validators.required
              }),
              'plate': new FormControl(this.vehicle.plate, {
                validators: Validators.required
              })
            })
          })
      }
  }

  displayFn(c?: Company) {
    return c ? c.name : undefined;
  }

  onSubmit(){
    this.vehicle.company = this.companiesAutoCtrl.value;
    this.vehicle.model = this.vehicleForm.controls['model'].value;
    this.vehicle.plate = this.vehicleForm.controls['plate'].value;

      this.data == null ?
        this.resourcesService.vehicles.addVehicle(this.vehicle)
          .subscribe((data) => {
            this.resourcesService.vehicles.pushVehicle(data);
            this.snackbarService.successSnackBar("Vehicle successfully added");
          }) : this.resourcesService.vehicles.editVehicle(this.vehicle)
                .subscribe((data : resourceVehicle) => {
                  this.resourcesService.vehicles.switchVehicleById(this.vehicle);
                  this.snackbarService.successSnackBar("Vehicle successfully updated");
                });
    this.thisDialogRef.close(this.vehicle);
  }

  onCancel(){
    this.thisDialogRef.close("Cancel");
  }
}
