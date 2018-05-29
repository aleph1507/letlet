import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-enter-vehicle-modal',
  templateUrl: './enter-vehicle-modal.component.html',
  styleUrls: ['./enter-vehicle-modal.component.css']
})
export class EnterVehicleModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EnterVehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
