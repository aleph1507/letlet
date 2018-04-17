import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';

@Injectable()
export class AuthService {

  token: string;
  url = 'http://192.168.100.11:84/token';

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

  constructor(private http: HttpClient) { }

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
      console.log(data);
    })
  }

}
