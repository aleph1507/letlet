import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService: AuthService,
              public router: Router) { }


  ngOnInit() {
    console.log('this.authService.getToken(): ', this.authService.getToken());
    console.log('this.authService.getToken() == null: ', this.authService.getToken() == null);
    if(this.authService.getToken() == null){
      console.log('vo if: this.authService.getToken(): ', this.authService.getToken());
      this.router.navigate(['/login']);
    }
  }

}
