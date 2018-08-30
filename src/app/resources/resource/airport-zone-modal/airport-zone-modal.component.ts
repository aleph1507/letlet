import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { AirportZone } from '../../../models/AirportZone';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-airport-zone-modal',
  templateUrl: './airport-zone-modal.component.html',
  styleUrls: ['./airport-zone-modal.component.css']
})
export class AirportZoneModalComponent implements OnInit {

  zone: AirportZone;
  zoneForm: FormGroup;
  oldID: number = null;

  constructor(public dialogRef: MatDialogRef<AirportZoneModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data){
      this.resourcesService.airportZones.getAirportZoneById(this.data)
        .subscribe((data: AirportZone) => {
          this.zone = data;
          this.oldID = this.data;
          this.zoneForm = new FormGroup({
            // 'id': new FormControl(this.zone ? this.zone.id : '', {
            //   validators: [Validators.required],
            //   updateOn: 'change'
            // }),
            'code': new FormControl(this.zone ? this.zone.code : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'name': new FormControl(this.zone ? this.zone.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            })
          });
        });
    }

    this.zoneForm = new FormGroup({
      // 'id': new FormControl(this.zone ? this.zone.id : '', {
      //   validators: [Validators.required],
      //   updateOn: 'change'
      // }),
      'code': new FormControl(this.zone ? this.zone.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.zone ? this.zone.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.zone = {
      id: this.oldID,
      code: this.zoneForm.controls['code'].value,
      name: this.zoneForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.airportZones.editAirportZone(this.zone, this.oldID)
        .subscribe((data : AirportZone) => {
          this.resourcesService.airportZones.switchAirportZone(this.zone, this.oldID);
          this.snackbarService.successSnackBar("Airport zone successfully updated");
        });
    } else {
      this.resourcesService.airportZones.addAirportZone(this.zone)
        .subscribe((data : AirportZone) => {
          // console.log(data);
          this.resourcesService.airportZones.pushAirportZone(data);
          this.snackbarService.successSnackBar("Airport zone successfully added");
        });
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
