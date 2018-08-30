import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourcesService } from '../../../services/resources.service';
import { Gate } from '../../../models/Gate';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-gate-modal',
  templateUrl: './gate-modal.component.html',
  styleUrls: ['./gate-modal.component.css']
})
export class GateModalComponent implements OnInit {

  gate: Gate;
  gateForm: FormGroup;
  oldID: number = null;

  constructor(public dialogRef: MatDialogRef<GateModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private resourcesService: ResourcesService,
              private snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data){
      this.resourcesService.gates.getGateById(this.data)
        .subscribe((data : Gate) => {
          this.gate = data;
          this.oldID = this.data;
          this.gateForm = new FormGroup({
            // 'id': new FormControl(this.gate ? this.gate.id : '', {
            //   validators: [Validators.required],
            //   updateOn: 'change'
            // }),
            'name': new FormControl(this.gate ? this.gate.name : '', {
              validators: [Validators.required],
              updateOn: 'change'
            })
          });
        });

    }

    this.gateForm = new FormGroup({
      // 'id': new FormControl(this.gate ? this.gate.id : '', {
      //   validators: [Validators.required],
      //   updateOn: 'change'
      // }),
      'name': new FormControl(this.gate ? this.gate.name : '', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit() {
    this.gate = {
      id: this.oldID,
      name: this.gateForm.controls['name'].value
    }
    if(this.data){
      this.resourcesService.gates.updateGate(this.gate, this.oldID)
        .subscribe((data : Gate) => {
          this.snackbarService.successSnackBar("Gate successfully updated");
          this.resourcesService.gates.switchGate(this.gate, this.oldID);
        });
    } else {
      this.resourcesService.gates.addGate(this.gate)
        .subscribe((data : Gate) => {
          this.snackbarService.successSnackBar("Gate successfully added");
          this.resourcesService.gates.pushGate(data);
        });
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
