import { Component, OnInit } from '@angular/core';
import { GatesService } from '../services/gates.service';
import { AuthService } from '../services/auth.service';
import { ResourcesService } from '../services/resources.service';
import { Gate } from '../models/Gate';

@Component({
  selector: 'app-gates',
  templateUrl: './gates.component.html',
  styleUrls: ['./gates.component.css']
})
export class GatesComponent implements OnInit {

  gates : Gate[] = [];

  constructor(private gatesService: GatesService,
              private authService: AuthService,
              private resourceService: ResourcesService) { }

  ngOnInit() {
    this.resourceService.gates.getAllGates()
      .subscribe((res : Gate[]) => {
        this.gates = res;
      });
  }

}
