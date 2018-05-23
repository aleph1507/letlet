import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { VisitorBadge } from '../../../models/VisitorBadge';

@Component({
  selector: 'app-visitor-badge-modal',
  templateUrl: './visitor-badge-modal.component.html',
  styleUrls: ['./visitor-badge-modal.component.css']
})
export class VisitorBadgeModalComponent implements OnInit {

  vb: VisitorBadge;
  vbForm: FormGroup;
  oldID: string;


  constructor(public dialogRef: MatDialogRef<VisitorBadgeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {

    this.vbForm = new FormGroup({
      'id': new FormControl(this.vb ? this.vb.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'code': new FormControl(this.vb ? this.vb.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.vb ? this.vb.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'barcode': new FormControl(this.vb ? this.vb.barcode : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });

    if(this.data){
      // this.vb = this.resourcesService.visitorBadges.getVisitorBadgeById(this.data).subscribe();
      console.log('data - ' + this.data);
      this.resourcesService.visitorBadges.getVisitorBadgeById(this.data)
        .subscribe((vb : VisitorBadge) => {
          this.vb = vb;
          this.oldID = this.data;
          this.vbForm = new FormGroup({
            'id': new FormControl(this.vb ? this.vb.id : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'code': new FormControl(this.vb ? this.vb.code : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'name': new FormControl(this.vb ? this.vb.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            }),
            'barcode': new FormControl(this.vb ? this.vb.barcode : '', {
              validators: [Validators.required],
              updateOn: 'change'
            })
          });
      });
      // this.oldID = this.data;
    }


  }

  onSubmit() {
    this.vb = {
      id: this.vbForm.controls['id'].value,
      code: this.vbForm.controls['code'].value,
      name: this.vbForm.controls['name'].value,
      barcode: this.vbForm.controls['barcode'].value
    }
    if(this.data){
      this.resourcesService.visitorBadges.updateVisitorBadge(this.vb, this.oldID)
        .subscribe(vb => this.resourcesService.visitorBadges.switchVisitorBadge(vb, this.oldID));
    } else {
      this.resourcesService.visitorBadges.addVisitorBadge(this.vb)
        .subscribe(vb => this.resourcesService.visitorBadges.pushVisitorBadge(vb));
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
