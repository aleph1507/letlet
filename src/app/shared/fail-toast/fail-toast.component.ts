import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-fail-toast',
  templateUrl: './fail-toast.component.html',
  styleUrls: ['./fail-toast.component.css']
})
export class FailToastComponent implements OnInit {

  // public msg = this.snackbarService.getMessage();
  public msg = '';
  // snackbarService;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any) { }

  ngOnInit() {
    if(this.data)
      this.msg = this.data;
  }
}
