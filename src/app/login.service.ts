import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {

  loggedIn = false;

  constructor(private router: Router) { }

  logIn(){
    console.log('login service: loggedIn: ', this.loggedIn);
    this.loggedIn = true;
    this.router.navigate(['/']);
  }

  logOut() {
    this.loggedIn = false;
  }

  isLoggedIn(){
    
    return this.loggedIn;
  }

}
