import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Gate } from '../../../models/Gate';

@Component({
  selector: 'app-gate-modal',
  templateUrl: './gate-modal.component.html',
  styleUrls: ['./gate-modal.component.css']
})
export class GateModalComponent implements OnInit {

  gate: Gate;
  gateForm: FormGroup;
  oldID: string;

  constructor(public dialogRef: MatDialogRef<GateModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    if(this.data){
      this.gate = this.resourcesService.gates.getGateById(this.data);
      this.oldID = this.data;
    }

    this.gateForm = new FormGroup({
      'id': new FormControl(this.gate ? this.gate.id : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'code': new FormControl(this.gate ? this.gate.code : '', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      'name': new FormControl(this.gate ? this.gate.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.gate = {
      id: this.gateForm.controls['id'].value,
      code: this.gateForm.controls['code'].value,
      name: this.gateForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.gates.editGate(this.gate, this.oldID);
    } else {
      this.resourcesService.gates.addGate(this.gate);
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
