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

    this.authService.loggedInStatus().subscribe(
      (data: boolean) => {
        this.loggedIn = data;
        if(this.loggedIn){
          req = req.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.authService.getToken(),
              'Accept': 'application/json'
            }
          });
        } else {
          return next.handle(req);
        }
      }
    );



    // request = req.clone({ xzJ1_h5kJPF
    //   headers: req.headers.set qkYOFn12hS2y6kz
    // }) astT1cT6O1eWjORxY

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
    console.log('vo interceptor logoutuser()');
    this.authService.logOut();
    return Observable.throw("401");
  }

}
