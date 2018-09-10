import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit{

  public token: string = null;
  // url = 'http://192.168.100.82:84/token';
  // public baseUrl = 'http://viksadesign.ddns.net:84/';
  // public baseUrl = 'http://localhost:63602/';
  public baseUrl = 'http://192.168.100.80:84';
  url = this.baseUrl + '/token';
  loggedIn : boolean = false;
  private loggedStatus : BehaviorSubject<boolean>;


  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //     // 'Accept': 'application/json'
  //     // 'Access-Control-Allow-Origin':'*'
  //   })
  // }

  username: string = '';
  fullname: string = '';
  lastPasswordChangedDate: string = '';
  passChangedDate: BehaviorSubject<string>;

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient,
              private router: Router) {
                this.loggedStatus = new BehaviorSubject<boolean>(this.loggedIn);
                this.passChangedDate = new BehaviorSubject<string>(this.lastPasswordChangedDate);
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

  passwordStatus() : Observable<string>{
    return this.passChangedDate.asObservable();
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
        if(this.token != null){
          this.loggedIn = true;
          this.loggedStatus.next(this.loggedIn);
          this.getRole()
            .subscribe(role =>{
              localStorage.setItem('role', role);
            });
          // this.http.get(this.baseUrl + '/api/account/user/' + username)
          this.http.get(this.baseUrl + '/api/account/user/info')
            .subscribe(data =>{
              // if(data['fullname'])
              localStorage.setItem('fullname', data['fullName'].toString());
              this.lastPasswordChangedDate = data['lastPasswordChangedDate'];
              this.passChangedDate.next(this.lastPasswordChangedDate);
            });
          localStorage.setItem('username', username);
          this.router.navigate(['/dashboard']);
        }

      }
      else {
        this.loggedIn = false;
        localStorage.setItem('token', null);
        this.token = null;
      }
      // console.log('TTTOKKKEEN::: ' + this.token);
    })
  }

  getLastPasswordChangedDate(){
    console.log('authService: this.lastPasswordChangedDate: ', this.lastPasswordChangedDate);
    return this.lastPasswordChangedDate;
  }

  getFullname(){
    return localStorage.getItem('fullname');
  }

  getRole() : Observable<string>{
    localStorage.setItem('role', null);
    return this.http.get<string>(this.baseUrl + '/api/account/user/roles');
  }

  role(){
    // console.log('isAdmin: ', this.isAdmin());
    return localStorage.getItem('role');
  }

  isAdmin() {
    let roles = localStorage.getItem('role');
    // console.log('isAdmin.roles: ', roles);
    return roles != null ? (roles.indexOf('Admin') != -1 ? true : false) : false;
  }

  isOperator(){
    let roles = localStorage.getItem('role');
    // console.log('isAdmin.roles: ', roles);
    return roles != null ? (roles.indexOf('Operator') != -1 ? true : false) : false;
  }

  isUser() {
    let roles = localStorage.getItem('role');
    // console.log('isAdmin.roles: ', roles);
    return roles != null ? (roles.indexOf('User') != -1 ? true : false) : false;
  }

  isPowerUser() {
    let roles = localStorage.getItem('role');
    // console.log('isAdmin.roles: ', roles);
    return roles != null ? (roles.indexOf('PowerUser') != -1 ? true : false) : false;
  }

  logOut(){
    localStorage.setItem('token', null);
    localStorage.setItem('role', null);
    localStorage.setItem('username', null);
    localStorage.setItem('fullname', null);
    this.token = null;
    this.loggedIn = false;
    this.loggedStatus.next(this.loggedIn);
    this.router.navigate(['/login']);
  }

}
