import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Role } from '../../models/Role';

class Checkboxes {
  id: string;
  name: string;
  checked:boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  chkboxes = new Array<Checkboxes>();

  constructor(public dialogRef: MatDialogRef<User>,
              @Inject(MAT_DIALOG_DATA) public data: User,
              private userService: UserService,
              public snackbarService: SnackbarService) { }

  ngOnInit() {
    this.userService.getRoles()
      .subscribe((roles: Role[]) =>{
        for(let i = 0; i<roles.length; i++){
          let cb = new Checkboxes();
          cb.id = roles[i].id;
          cb.name = roles[i].name;
          cb.checked = this.data.roles.indexOf(roles[i].name) != -1 ? true : false;
          this.chkboxes.push(cb);
        }
      });
  }

  setRoles() {
    let roles = [];
    for(let i = 0; i<this.chkboxes.length; i++)
      if(this.chkboxes[i].checked == true) roles.push(this.chkboxes[i].name);

    this.userService.setRoles(this.data.id, roles)
      .subscribe(data => {this.dialogRef.close()});
  }

  onCancel() {
    this.dialogRef.close();
  }

}
