import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-exit-vehicle-modal',
  templateUrl: './exit-vehicle-modal.component.html',
  styleUrls: ['./exit-vehicle-modal.component.css']
})
export class ExitVehicleModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ExitVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
