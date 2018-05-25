import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Reason } from '../../../models/Reason';


@Component({
  selector: 'app-reason-modal',
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.css']
})
export class ReasonModalComponent implements OnInit {

  reason: Reason;
  reasonForm: FormGroup;
  oldID: number = null;

  constructor(public dialogRef: MatDialogRef<ReasonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.resourcesService.reasons.getReasonById(this.data)
        .subscribe((data : Reason) => {
          this.reason = data;
          this.oldID = this.data;
          this.reasonForm = new FormGroup({
            'name': new FormControl(this.reason ? this.reason.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            })
          });
        });
    }

    this.reasonForm = new FormGroup({
      'name': new FormControl(this.reason ? this.reason.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.reason = {
      id: this.oldID,
      name: this.reasonForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.reasons.updateReason(this.reason, this.oldID)
        .subscribe((data : Reason) => {
          this.resourcesService.reasons.switchReason(data, this.oldID)
        });
    } else {
      this.resourcesService.reasons.addReason(this.reason)
        .subscribe((data : Reason) => {
          console.log('data: ' + data.id);
          this.resourcesService.reasons.pushReason(data)
        });
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
