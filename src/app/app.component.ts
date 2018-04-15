import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ASEC';

  loggedIn = this.loginService.isLoggedIn();

  constructor(private loginService: LoginService,
              private router: Router){}

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }


}
