import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-exit-person-modal',
  templateUrl: './exit-person-modal.component.html',
  styleUrls: ['./exit-person-modal.component.css']
})
export class ExitPersonModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ExitPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
