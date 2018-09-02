import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../models/User';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm : FormGroup;
  user: User = null;
  id = null;
  @ViewChild('pass') pass;
  @ViewChild('cpass') cpass;

  constructor(public dialogRef: MatDialogRef<User>,
              @Inject(MAT_DIALOG_DATA) public data: User,
              private userService: UserService,
              public snackbarService: SnackbarService) { }

  ngOnInit() {
    if(this.data != null) {
      this.user = this.data;
      this.id = this.data.id;
    }

    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(){
    return new FormGroup({
      'firstName': new FormControl(this.user ? this.user.fullName.split(' ')[0] : '',{
        validators: [Validators.required]
      }),
      'lastName': new FormControl(this.user ? this.user.fullName.split(' ')[1] : '',{
        validators: [Validators.required]
      }),
      'userName': new FormControl(this.user ? this.user.userName : '',{
        validators: [Validators.required]
      }),
      'email': new FormControl(this.user ? this.user.email : '',{
        validators: [Validators.required, Validators.email]
      }),
      'level': new FormControl(this.user ? this.user.level : '',{
        validators: [Validators.required]
      }),
      'position': new FormControl(this.user ? this.user.position : '',{
        validators: [Validators.required]
      }),
      'password': new FormControl(this.user ? this.user.password : '',{
        validators: [Validators.required]
      }),
      'confirmPassword': new FormControl(this.user ? this.user.confirmPassword : '', {
        validators: [Validators.required]
      })
    })
  }

  confirmPass(){
    return this.pass.nativeElement.value == this.cpass.nativeElement.value && this.pass.nativeElement.value.length >= 6;
  }

  onSubmit() {
    this.user = new User;
    if(this.id) this.user.id = this.id;
    this.user.firstName = this.registerForm.controls['firstName'].value;
    this.user.lastName = this.registerForm.controls['lastName'].value;
    this.user.userName = this.registerForm.controls['userName'].value;
    this.user.email = this.registerForm.controls['email'].value;
    this.user.level = this.registerForm.controls['level'].value;
    this.user.position = this.registerForm.controls['position'].value;
    this.user.password = this.registerForm.controls['password'].value;
    this.user.confirmPassword = this.registerForm.controls['confirmPassword'].value;

    if(this.data == null){
      this.userService.addUser(this.user)
        .subscribe((data : User) => {
          console.log('user: ', data);
          this.dialogRef.close();
        });
    } else {
      this.userService.editUser(this.user)
        .subscribe((data: User) =>{
          console.log('user: ', data);
          this.dialogRef.close();
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
