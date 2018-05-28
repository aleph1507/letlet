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
  loggedIn : boolean;

  // loggedIn = this.loginService.isLoggedIn();

  constructor(private authService: AuthService,
              private router: Router){}

  ngOnInit(): void {
    if(this.authService.getToken() == null){
      this.router.navigate(['/login']);
    }

    console.log('pred loggedInStatus subscription app.component');

    this.authService.loggedInStatus()
      .subscribe((loggedIn : boolean) => {
        console.log('vo loggedInStatus subscription app.component');
        this.loggedIn = loggedIn;
        console.log('subscription loggedIn: ' + loggedIn);
        console.log('subscription this.loggedIn: ' + this.loggedIn)
      });

      console.log('app component loggedIn: ' + this.loggedIn);
    // this.loggedIn = this.authService.loggedIn;
  }

  logOut() {
    // this.loginService.logOut();
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }


}
