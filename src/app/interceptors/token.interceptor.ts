import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler,
          HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
          HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  loggedIn: boolean;
  constructor(public authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    var accept = 'application/json';
    if(req.url.indexOf('/api/requests/pdf') != -1){
      accept = 'application/pdf';
    } else {
      var accept = 'application/json';
    }
    if(req.url == this.authService.baseUrl, '/api/requests/pdf11')
    this.authService.loggedInStatus().subscribe(
      (data: boolean) => {
        this.loggedIn = data;
        if(this.loggedIn){
          req = req.clone({
            setHeaders: {
              'Content-Type': accept,
              'Authorization': 'Bearer ' + this.authService.getToken(),
              'Accept': accept
            }
          });
        } else {
          return next.handle(req);
        }
      }
    );

    return next.handle(req)
      .catch(error => {
        if(error instanceof HttpErrorResponse){
          if(error.status === 401){
            return this.logoutUser();
          }
        }
      });
  }

  handle401(req: HttpRequest<any>, next: HttpHandler){
    return this.logoutUser();
  }

  logoutUser() {
    this.authService.logOut();
    return Observable.throw("401");
  }

}
