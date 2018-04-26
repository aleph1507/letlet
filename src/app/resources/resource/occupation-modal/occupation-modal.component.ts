import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Occupation } from '../../../models/Occupation';

@Component({
  selector: 'app-occupation-modal',
  templateUrl: './occupation-modal.component.html',
  styleUrls: ['./occupation-modal.component.css']
})
export class OccupationModalComponent implements OnInit {

  occupation: Occupation;
  occupationForm: FormGroup;
  oldID: string;

  constructor(public dialogRef: MatDialogRef<OccupationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.occupation = this.resourcesService.occupations.getOccupationById(this.data);
      this.oldID = this.data;
    }

    this.occupationForm = new FormGroup({
      'id': new FormControl(this.occupation ? this.occupation.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'code': new FormControl(this.occupation ? this.occupation.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.occupation ? this.occupation.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.occupation = {
      id: this.occupationForm.controls['id'].value,
      code: this.occupationForm.controls['code'].value,
      name: this.occupationForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.occupations.editOccupation(this.occupation, this.oldID);
    } else {
      this.resourcesService.occupations.addOccupation(this.occupation);
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
