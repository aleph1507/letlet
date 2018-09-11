import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserService } from './services/user.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ASEC';
  loggedIn : boolean = false;
  role : string = this.authService.role();

  constructor(public authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              public userService: UserService,
              public snackbarService: SnackbarService){}

  ngOnInit(): void {

      localStorage.setItem('token', null);
      localStorage.setItem('role', null);
      localStorage.setItem('username', null);
      localStorage.setItem('fullname', null);
      this.authService.token = null;
      this.authService.loggedIn = false;
      this.authService.loggedStatus.next(this.loggedIn);
      this.router.navigate(['/login']);
    if(this.authService.getToken() === null){
      this.router.navigate(['/login']);
    }

    this.authService.loggedInStatus()
      .subscribe((loggedIn : boolean) => {
        this.loggedIn = loggedIn;
      });

      this.checkPasswordExpiry();
  }

  changePassword(data = null) {
    this.dialog.open(ChangePasswordComponent, {
      data: {msg: data, onLogIn: true},
      width: '70%'
    });
  }

  checkPasswordExpiry() {
    let warnLastDays = 7, passwordLifeSpan = 45;
    this.authService.passwordStatus()
      .subscribe(pcd => {
        let passChDate = new Date(pcd), currentDate = new Date();
        let passDateDiff = Math.ceil((currentDate.getTime() - passChDate.getTime()) / (1000 * 60 * 60 * 24));
        if((passwordLifeSpan - passDateDiff) <= warnLastDays){
          let msg = 'You have ' + (warnLastDays - (passDateDiff % warnLastDays)) + ' days to change your password before it expires';
          this.changePassword(msg);
        }
      });
  }

  logOut() {
    this.authService.logOut();
  }
}
