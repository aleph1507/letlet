import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private userService: UserService,
              private authService: AuthService,
              public confirmDialog: MatDialog,
              public snackbarService: SnackbarService) { }

  ngOnInit() {
    this.changePasswordForm = this.createChangePasswordForm();
    if(this.data){
      this.changePasswordForm.controls['oldPassword'].clearValidators();
      this.changePasswordForm.controls['oldPassword'].updateValueAndValidity();
    }
  }

  createChangePasswordForm() {
    return new FormGroup({
      'oldPassword': new FormControl('', {
        validators: [Validators.required]
      }),
      'newPassword': new FormControl('', {
        validators: [Validators.required]
      }),
      'confirmNewPassword': new FormControl('', {
        validators: [Validators.required]
      })
    })
  }

  confirm() {
    return (this.changePasswordForm.controls['newPassword'].value == this.changePasswordForm.controls['confirmNewPassword'].value) &&
      this.changePasswordForm.controls['newPassword'].value.length >= 6;
  }

  onSubmit() {
    let newPassword = this.changePasswordForm.controls['newPassword'].value;
    let confirmNewPassword = this.changePasswordForm.controls['confirmNewPassword'].value;
    if(!this.data || (this.data && this.data.onLogIn)){
      let oldPassword = this.changePasswordForm.controls['oldPassword'].value;
      this.userService.changeOwnPassword({oldPassword, newPassword, confirmNewPassword})
        .subscribe(data => {
          this.dialogRef.close();
        });
    } else {
      this.userService.changeUserPassword(this.data.uid, {newPassword, confirmNewPassword})
        .subscribe(data =>{
          this.dialogRef.close();
        });
    }
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }

}
