import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-success-toast',
  templateUrl: './success-toast.component.html',
  styleUrls: ['./success-toast.component.css']
})
export class SuccessToastComponent implements OnInit {

  public msg = this.snackbarService.getMessage();

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit() {
  }

}
