import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandlerService {

  constructor(public errbar: MatSnackBar) { }

  public handleError(err: any){
    this.errbar.open(err.message, 'close');
  }

}
