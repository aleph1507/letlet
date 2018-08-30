import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class LoginService {

  // loggedIn = false;

  constructor(private router: Router,
              private authService: AuthService) { }

  // logIn(){
  //   console.log('login service: loggedIn: ', this.loggedIn);
  //   this.loggedIn = true;
  //   this.router.navigate(['/']);
  // }

  logOut() {
    this.authService.logOut();
    // this.loggedIn = false;
  }

  isLoggedIn(){

    // return this.loggedIn;
  }

}
