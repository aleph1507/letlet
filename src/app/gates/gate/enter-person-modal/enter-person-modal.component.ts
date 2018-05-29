import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-enter-person-modal',
  templateUrl: './enter-person-modal.component.html',
  styleUrls: ['./enter-person-modal.component.css']
})
export class EnterPersonModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EnterPersonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
