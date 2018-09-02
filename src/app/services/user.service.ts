import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  private userUrl = this.authService.baseUrl + '/api/account/users';
  private createUserUrl = this.authService.baseUrl + '/api/account/create'
  private singleUser = this.authService.baseUrl + '/api/account/user';

  constructor(private authService: AuthService,
              private http: HttpClient) { }

  getUsers() : Observable<User[]>{
    return this.http.get<User[]>(this.userUrl);
  }

  getUserById(id: number) : Observable<User>{
    return this.http.get<User>(this.singleUser + '/' + id);
  }

  addUser(user: User) {
    return this.http.post<User>(this.createUserUrl, user);
  }

  editUser(user: User) {
    return this.http.put(this.singleUser + '/' + user.id, user);
  }

}
