import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SuccessToastComponent } from '../shared/success-toast/success-toast.component';

@Injectable()
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) { this.msg = "Успешно!"; }

  msg: string = "";

  getMessage(): string {
    return this.msg;
  }

  successSnackBar(msg = "Успешно!") {
    this.msg = msg;
    setTimeout(() => {
      const config = new MatSnackBarConfig();
      config.panelClass = ['snackbar-success'];
      config.duration = 3000;
      this.snackBar.openFromComponent(SuccessToastComponent, config);
    });
  }


}
