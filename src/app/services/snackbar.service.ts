import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SuccessToastComponent } from '../shared/success-toast/success-toast.component';
import { FailToastComponent } from '../shared/fail-toast/fail-toast.component';

@Injectable()
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) { this.msg = "Success!"; }

  msg: string = "";

  getMessage(): string {
    return this.msg;
  }

  successSnackBar(msg = "Success!") {
    this.msg = msg;
    setTimeout(() => {
      const config = new MatSnackBarConfig();
      config.panelClass = ['snackbar-success'];
      config.duration = 3000;
      config.data = msg;
      this.snackBar.openFromComponent(SuccessToastComponent, config);
    });
  }

  failSnackBar(msg = "An error has occurred"){
    this.msg = msg;
    setTimeout(() => {
      const config = new MatSnackBarConfig();
      config.panelClass = ['snackbar-fail'];
      config.duration = 3000;
      config.data = msg;
      this.snackBar.openFromComponent(FailToastComponent, config);
    });
  }


}
