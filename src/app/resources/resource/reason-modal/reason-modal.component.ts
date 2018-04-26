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
  oldID: string;

  constructor(public dialogRef: MatDialogRef<ReasonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.reason = this.resourcesService.reasons.getReasonById(this.data);
      this.oldID = this.data;
    }

    this.reasonForm = new FormGroup({
      'id': new FormControl(this.reason ? this.reason.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'code': new FormControl(this.reason ? this.reason.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.reason ? this.reason.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.reason = {
      id: this.reasonForm.controls['id'].value,
      code: this.reasonForm.controls['code'].value,
      name: this.reasonForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.reasons.editReason(this.reason, this.oldID);
    } else {
      this.resourcesService.reasons.addReason(this.reason);
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
