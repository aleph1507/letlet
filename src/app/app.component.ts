import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ASEC';
  loggedIn : boolean = false;

  // loggedIn = this.loginService.isLoggedIn();

  constructor(private authService: AuthService,
              private router: Router){}

  ngOnInit(): void {
    // this.authService.init();
    console.log('onInit loggedIn: ', this.loggedIn);
    console.log('authService.getToken: ', this.authService.getToken());
    if(this.authService.getToken() == 'null'){
      console.log('null Token loggedIn: ', this.loggedIn);
      console.log('pred navigate[/]');
      this.router.navigate(['/login']);
    }

    this.authService.loggedInStatus()
      .subscribe((loggedIn : boolean) => {
        console.log('vo loggedIn subscription: ', loggedIn);
        this.loggedIn = loggedIn;
      });
    // this.loggedIn = this.authService.loggedIn;
  }

  logOut() {
    this.authService.logOut();
    // this.loginService.logOut();
    // this.loggedIn = false;
    // this.router.navigate(['/login']);
  }


}
