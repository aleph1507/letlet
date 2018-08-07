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

  constructor(public authService: AuthService,
              private router: Router){}

  ngOnInit(): void {
    // this.authService.init();
    if(this.authService.getToken() == 'null'){
      this.router.navigate(['/login']);
    }

    this.authService.loggedInStatus()
      .subscribe((loggedIn : boolean) => {
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
