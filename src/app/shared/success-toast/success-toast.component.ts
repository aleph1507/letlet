import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-success-toast',
  templateUrl: './success-toast.component.html',
  styleUrls: ['./success-toast.component.css']
})
export class SuccessToastComponent implements OnInit {

  // public msg = this.snackbarService.getMessage();
  public msg = '';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
    if(this.data)
      this.msg = this.data;
  }

}
