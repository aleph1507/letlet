import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit{

  public token: string = null;
  public baseUrl = 'http://192.168.100.80:84';
  url = this.baseUrl + '/token';
  loggedIn : boolean = false;
  public loggedStatus : BehaviorSubject<boolean>;

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
              }

  ngOnInit(): void {

  }

  loggedInStatus() : Observable<boolean>{
    return this.loggedStatus.asObservable();
  }

  passwordStatus() : Observable<string>{
    return this.passChangedDate.asObservable();
  }

  getHeaders() {
    if(this.loggedIn){
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken(),
        'Accept': 'application/json'
      })
    } else  {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'client_id': "AsecClient"
      });
    }
  }

  getBaseUrl() {
    return this.http.get('url.conf');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logIn(username: string, password:string, gt = "password", cid = "AsecClient") {
    const body = new HttpParams()
      .set('grant_type', gt)
      .set('username', username)
      .set('password', password)
      .set('client_id', cid);

    localStorage.setItem('token', null);
    localStorage.setItem('role', null);
    localStorage.setItem('username', null);
    localStorage.setItem('fullname', null);
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
          this.http.get(this.baseUrl + '/api/account/user/info')
            .subscribe(data =>{
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
    })
  }

  getLastPasswordChangedDate(){
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
    return localStorage.getItem('role');
  }

  isAdmin() {
    let roles = localStorage.getItem('role');
    return roles != null ? (roles.indexOf('Admin') != -1 ? true : false) : false;
  }

  isOperator(){
    let roles = localStorage.getItem('role');
    return roles != null ? (roles.indexOf('Operator') != -1 ? true : false) : false;
  }

  isUser() {
    let roles = localStorage.getItem('role');
    return roles != null ? (roles.indexOf('User') != -1 ? true : false) : false;
  }

  isPowerUser() {
    let roles = localStorage.getItem('role');
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
