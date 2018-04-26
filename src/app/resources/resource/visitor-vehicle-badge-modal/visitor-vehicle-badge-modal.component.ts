import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { VisitorVehicleBadge } from '../../../models/VisitorVehicleBadge';

@Component({
  selector: 'app-visitor-vehicle-badge-modal',
  templateUrl: './visitor-vehicle-badge-modal.component.html',
  styleUrls: ['./visitor-vehicle-badge-modal.component.css']
})
export class VisitorVehicleBadgeModalComponent implements OnInit {

  vvb: VisitorVehicleBadge;
  vvbForm: FormGroup;
  oldID: string;

  constructor(public dialogRef: MatDialogRef<VisitorVehicleBadgeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.vvb = this.resourcesService.visitorVehicleBadges.getVisitorVehicleBadgeById(this.data);
      this.oldID = this.data;
    }

    this.vvbForm = new FormGroup({
      'id': new FormControl(this.vvb ? this.vvb.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'code': new FormControl(this.vvb ? this.vvb.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'number': new FormControl(this.vvb ? this.vvb.number : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.vvb = {
      id: this.vvbForm.controls['id'].value,
      code: this.vvbForm.controls['code'].value,
      number: this.vvbForm.controls['number'].value
    }
    if(this.data){
      this.resourcesService.visitorVehicleBadges.editVisitorVehicleBadge(this.vvb, this.oldID);
    } else {
      this.resourcesService.visitorVehicleBadges.addVisitorVehicleBadge(this.vvb);
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
