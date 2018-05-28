import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) { }

  logIn() {
    // console.log("login.logIn");
    // this.loginService.logIn();
    this.authService.logIn(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
  }


  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'password': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      })
    })
  }

}
