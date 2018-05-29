import { Component, OnInit } from '@angular/core';
import { GatesService } from '../../services/gates.service';
import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute } from '@angular/router';
import { EnteredPerson } from '../../models/EnteredPerson.model';
import { EnteredVehicle } from '../../models/EnteredVehicles.model';
import { ExpectedPerson } from '../../models/ExpectedPerson.model';
import { ExpectedVehicle } from '../../models/ExpectedVehicle.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.css']
})
export class GateComponent implements OnInit {

  gid : number = null;
  enteredPersons : EnteredPerson[] = [];
  enteredVehicles : EnteredVehicle[] = [];
  expectedPersons : ExpectedPerson[] = [];
  expectedVehicle : ExpectedVehicle[] = [];
  // gore levo entered
  dataSource;

  displayedColumns = ['nameEn', 'surnameEn', 'companyName', 'enter'];

  constructor(private gatesService: GatesService,
              private authService: AuthService,
              private resourceService: ResourcesService,
              private route: ActivatedRoute,) { }

  ngOnInit() {
    this.getExpectedPersons();
  }

  getExpectedPersons() {
    this.gatesService.getAllExpectedPersons()
      .subscribe((data : ExpectedPerson[]) => {
        this.expectedPersons = data;
        this.dataSource = new MatTableDataSource<ExpectedPerson>(this.expectedPersons);
        console.log(`expected persons: ${this.expectedPersons}`);
        console.log(`dataSource: ${this.dataSource}`);
      });
  }

  enterExpectedPerson() {

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
