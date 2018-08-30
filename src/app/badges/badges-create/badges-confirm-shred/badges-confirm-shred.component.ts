import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BadgesService } from '../../../services/badges.service';

@Component({
  selector: 'app-badges-confirm-shred',
  templateUrl: './badges-confirm-shred.component.html',
  styleUrls: ['./badges-confirm-shred.component.css']
})
export class BadgesConfirmShredComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BadgesConfirmShredComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private badgesService: BadgesService) { }

  ngOnInit() {
  }

}
