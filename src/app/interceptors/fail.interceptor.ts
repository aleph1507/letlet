import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler,
          HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
          HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
import { SnackbarService } from "../services/snackbar.service";

@Injectable()
export class FailInterceptor implements HttpInterceptor {

  loggedIn: boolean;
  constructor(public authService: AuthService,
              public snackbarService: SnackbarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    return next.handle(req)
      .catch((error, caught) => {
        let msg: string = 'An error has occurred';
        msg += error.error ? (error.error.error_description ? ': ' + error.error.error_description : '') : '';
        msg += '\n' + error.error.exceptionMessage;
        this.snackbarService.failSnackBar(msg);
        return Observable.throw(error);
      });

  }
}
