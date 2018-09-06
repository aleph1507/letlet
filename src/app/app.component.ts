import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ASEC';
  loggedIn : boolean = false;
  role : string = this.authService.role();


  // loggedIn = this.loginService.isLoggedIn();

  constructor(public authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              public userService: UserService){}

  ngOnInit(): void {
    // this.authService.init();
    if(this.authService.getToken() == 'null'){
      this.router.navigate(['/login']);
    }

    this.authService.loggedInStatus()
      .subscribe((loggedIn : boolean) => {
        this.loggedIn = loggedIn;
      });

      console.log('role: ', this.role);

      console.log('authService.getFullname: ', this.authService.getFullname());
      this.checkPasswordExpiry();
    // this.loggedIn = this.authService.loggedIn;
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '70%'
    });
  }

  checkPasswordExpiry() {
    console.log('typeof this.authService.getLastPasswordChangedDate(): ', typeof this.authService.getLastPasswordChangedDate());
    console.log('this.authService.getLastPasswordChangedDate()', this.authService.getLastPasswordChangedDate());
    let lastPasswordChangedDate = new Date(this.authService.getLastPasswordChangedDate());
    console.log('typeof lastPasswordChangedDate: ', typeof lastPasswordChangedDate);
    console.log('lastPasswordChangedDate: ', lastPasswordChangedDate);
  }

  logOut() {
    this.authService.logOut();
    // this.loginService.logOut();
    // this.loggedIn = false;
    // this.router.navigate(['/login']);
  }


}
