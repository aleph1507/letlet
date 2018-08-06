import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { VisitorVehicleBadge } from '../../../models/VisitorVehicleBadge';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-visitor-vehicle-badge-modal',
  templateUrl: './visitor-vehicle-badge-modal.component.html',
  styleUrls: ['./visitor-vehicle-badge-modal.component.css']
})
export class VisitorVehicleBadgeModalComponent implements OnInit {

  vvb: VisitorVehicleBadge;
  vvbForm: FormGroup;
  oldID: number = null;

  constructor(public dialogRef: MatDialogRef<VisitorVehicleBadgeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data){
      this.resourcesService.visitorVehicleBadges.getVisitorVehicleBadgeById(this.data)
        .subscribe((vvb : VisitorVehicleBadge) => {
          console.log('vvb.name : ' + vvb.name);
          this.vvb = vvb;
          this.oldID = this.data;
          this.vvbForm = new FormGroup({
            // 'id': new FormControl(this.vvb ? this.vvb.id : '', {
            //   validators: [Validators.required],
            //   updateOn: 'change'
            // }),
            'code': new FormControl(this.vvb ? this.vvb.code : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'name': new FormControl(this.vvb ? this.vvb.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            })
          });
        });
      // this.oldID = this.data;
    }

    this.vvbForm = new FormGroup({
      // 'id': new FormControl(this.vvb ? this.vvb.id : '', {
      //   validators: [Validators.required],
      //   updateOn: 'change'
      // }),
      'code': new FormControl(this.vvb ? this.vvb.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.vvb ? this.vvb.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.vvb = {
      id: this.oldID,
      // id: this.vvbForm.controls['id'].value,
      code: this.vvbForm.controls['code'].value,
      name: this.vvbForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.visitorVehicleBadges.updateVisitorVehicleBadge(this.vvb, this.oldID)
        .subscribe((data : VisitorVehicleBadge) => {
          this.resourcesService.visitorVehicleBadges.switchVisitorVehicleBadge(this.vvb, this.oldID);
          this.snackbarService.successSnackBar("Visitor Vehicle Badge successfully updated");
        });
    } else {
      this.resourcesService.visitorVehicleBadges.addVisitorVehicleBadge(this.vvb)
        .subscribe((data : VisitorVehicleBadge) => {
          this.resourcesService.visitorVehicleBadges.pushVisitorVehicleBadge(data);
          this.snackbarService.successSnackBar("Visitor Vehicle Badge successfully added");
        })
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
