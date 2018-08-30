import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit{

  public token: string = null;
  // url = 'http://192.168.100.4:84/token';
  // public baseUrl = 'http://viksadesign.ddns.net:84/';
  public baseUrl = 'http://192.168.100.12:84';
  url = this.baseUrl + '/token';
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
                if(localStorage.getItem('token') != 'null'){
                  this.loggedIn = true;
                  this.loggedStatus.next(this.loggedIn);
                }
                // this.loggedIn = true;
                // this.loggedStatus.next(this.loggedIn);
              }

  ngOnInit(): void {

  }


  init() {
    // console.log('vo auth.init');
    // this.getBaseUrl().subscribe((data : string) => {
    //   this.baseUrl = data;
    //   console.log('baseUrl: ' + this.baseUrl);
    //   return this.baseUrl;
    // });
  }

  loggedInStatus() : Observable<boolean>{
    return this.loggedStatus.asObservable();
  }

  getHeaders() {
    // console.log('vo getHeaders()')
    if(this.loggedIn){
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken(),
        'Accept': 'application/json'
      })
    } else  {
      return null;
    }
  }

  getBaseUrl() {
    return this.http.get('url.conf');
  }

  getToken() {
    // if(this.token == null)
    //   this.logIn();
    // return this.token;
    // console.log('getToken()');
    // console.log('localStorage.getItem("token") :  ' + localStorage.getItem('token'));
    return localStorage.getItem('token');
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

    localStorage.setItem('token', null);
    this.http.post<LoginResponse>(this.url, body.toString(),
    { headers: this.headers }).subscribe(data => {
      if(data.access_token){
        this.token = data.access_token;
        localStorage.setItem('token', this.token);
        this.loggedIn = true;
        this.router.navigate(['/dashboard']);
        this.loggedStatus.next(this.loggedIn);
      }
      else {
        this.loggedIn = false;
        localStorage.setItem('token', null);
        this.token = null;
      }
      // console.log('TTTOKKKEEN::: ' + this.token);
    })
  }

  logOut(){
    localStorage.setItem('token', null);
    this.token = null;
    this.loggedIn = false;
    this.loggedStatus.next(this.loggedIn);
    this.router.navigate(['/login']);
  }

}
