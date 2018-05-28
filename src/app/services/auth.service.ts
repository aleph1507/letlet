import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  public token: string = null;
  url = 'http://192.168.100.4:84/token';
  baseUrl = null;
  loggedIn : boolean;
  private loggedStatus : BehaviorSubject<boolean>;


  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //     // 'Accept': 'application/json'
  //     // 'Access-Control-Allow-Origin':'*'
  //   })
  // }

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient,
              private router: Router) {
                this.loggedStatus = new BehaviorSubject<boolean>(this.loggedIn);
              }

  init() {
    this.getBaseUrl().subscribe((data : string) => {
      this.baseUrl = data;
      return this.baseUrl;
    });
  }

  loggedInStatus() : Observable<boolean>{
    console.log('vo authService.loggedInStatus');
    return this.loggedStatus.asObservable();
  }

  getHeaders() {
    if(this.loggedIn){
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json'
      })
    }
  }

  getBaseUrl() {
    return this.http.get('url.conf');
  }

  getToken() {
    // if(this.token == null)
    //   this.logIn();
    return this.token;
  }


  // logIn(username: string = 'Admin', password:string = 'admin1', gt = "password", cid = "AsecClient") {
  logIn(username: string, password:string, gt = "password", cid = "AsecClient") {
    // console.log("username: ", username);
    // console.log("password: ", password);
    // console.log("gt: ", gt);
    // console.log("cid: ", cid);
    const body = new HttpParams()
      .set('grant_type', gt)
      .set('username', username)
      .set('password', password)
      .set('client_id', cid);

    this.http.post<LoginResponse>(this.url, body.toString(),
    { headers: this.headers }).subscribe(data => {
      if(data.access_token){
        this.token = data.access_token;
        this.loggedIn = true;
        console.log('auth.service.token : ' + this.token);
        this.router.navigate(['/dashboard']);
        this.loggedStatus.next(this.loggedIn);
      }
      else {
        this.loggedIn = false;
        this.token = null;
      }
      console.log('TTTOKKKEEN::: ' + this.token);
    })
  }

}
