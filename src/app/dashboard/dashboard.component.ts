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
    if(this.authService.getToken() == null){
      this.router.navigate(['/login']);
    }
  }

}
