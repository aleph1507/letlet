import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  showSpinner : boolean  = true;
  users : User[] = [];
  displayedColumns = ['fullName', 'userName', 'position', 'edit'];
  dataSource : MatTableDataSource<User>

  constructor(private authService: AuthService,
              private userService: UserService,
              private dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.showSpinner = true;
    this.userService.getUsers().subscribe((data : User[]) => {
      this.users = data;
      data == null ? this.users = [] : this.users = data;
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.changeDetectorRefs.detectChanges();
      this.showSpinner = false;
    });
  }

  getUsers() {
    this.showSpinner = true;
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.showSpinner = false;
        this.dataSource = new MatTableDataSource<User>(this.users);
        console.log('this.users: ', this.users);
      });
  }

  openDialog(id = null){
    let dialogRef;
    if(id != null){
      this.userService.getUserById(id)
        .subscribe((res: User) => {
          dialogRef = this.dialog.open(RegisterComponent, {
            width: '70%',
            data: res
          }).afterClosed().subscribe(result => {this.refresh()});
        })
    } else {
        dialogRef = this.dialog.open(RegisterComponent, {
        width: '70%',
        data: null
        // data: { name: this.name, animal: this.animal }
      }).afterClosed().subscribe(result => {this.refresh()});
    }
  }

}
