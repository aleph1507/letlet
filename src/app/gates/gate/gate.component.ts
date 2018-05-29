import { Component, OnInit } from '@angular/core';
import { GatesService } from '../../services/gates.service';
import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute } from '@angular/router';
import { EnteredPerson } from '../../models/EnteredPerson.model';
import { EnteredVehicle } from '../../models/EnteredVehicles.model';
import { ExpectedPerson } from '../../models/ExpectedPerson.model';
import { ExpectedVehicle } from '../../models/ExpectedVehicle.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EnterPersonModalComponent } from './enter-person-modal/enter-person-modal.component';
import { ExitPersonModalComponent } from './exit-person-modal/exit-person-modal.component';
import { EnterVehicleModalComponent } from './enter-vehicle-modal/enter-vehicle-modal.component';
import { ExitVehicleModalComponent } from './exit-vehicle-modal/exit-vehicle-modal.component';
import { VisitPerson } from '../../models/VisitPerson.model';

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
  expectedVehicles : ExpectedVehicle[] = [];
  // gore levo entered
  dataSourceExpectedPersons;
  dataSourceEnteredPersons;
  dataSourceExpectedVehicles;
  dataSourceEnteredVehicles;

  displayedColumnsExpectedPerson = ['nameEn', 'surnameEn', 'companyName', 'enter'];
  displayedColumnsEnteredPerson = ['name', 'company', 'enteredGate', 'escortEmployee', 'approvedBy', 'exit'];
  displayedColumnsExpectedVehicle = ['model', 'plate', 'companyName', 'enter'];
  displayedColumnsEnteredVehicle = ['model', 'plate', 'company', 'enteredGate', 'escortEmployee', 'approvedBy', 'exit'];

  constructor(private gatesService: GatesService,
              private authService: AuthService,
              private resourceService: ResourcesService,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getExpectedPersons();
    this.getEnteredPersons();
    this.getEnteredVehicles();
    this.getExpectedVehicles();
    this.route.params.subscribe((params) => {
      this.gid = params.id;
    });
  }

  getExpectedPersons() {
    this.gatesService.getAllExpectedPersons()
      .subscribe((data : ExpectedPerson[]) => {
        this.expectedPersons = data;
        this.dataSourceExpectedPersons = new MatTableDataSource<ExpectedPerson>(this.expectedPersons);
      });
  }

  getEnteredPersons() {
    this.gatesService.getAllEnteredPersons()
      .subscribe((data : EnteredPerson[]) => {
        this.enteredPersons = data;
        this.dataSourceEnteredPersons = new MatTableDataSource<EnteredPerson>(this.enteredPersons);
      });
  }

  getExpectedVehicles() {
    this.gatesService.getAllExpectedVehicles()
      .subscribe((data : ExpectedVehicle[]) => {
        this.expectedVehicles = data;
        this.dataSourceExpectedVehicles = new MatTableDataSource<ExpectedVehicle>(this.expectedVehicles);
      });
  }

  getEnteredVehicles() {
    this.gatesService.getAllEnteredVehicles()
      .subscribe((data : EnteredVehicle[]) => {
        this.enteredVehicles = data;
        console.log('this.enteredvehicles: ' + this.enteredVehicles);
        this.dataSourceEnteredVehicles = new MatTableDataSource<EnteredVehicle>(this.enteredVehicles);
      });
  }



  enterExpectedPerson(ep: ExpectedPerson) {
    let dialogRef = this.dialog.open(EnterPersonModalComponent, {
      width: '40%',
      data: {gid: this.gid, ep: ep}
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilterExpectedPersons('');
    });
  }

  exitEnteredPerson(enteredp: EnteredPerson) {
    let dialogRef = this.dialog.open(ExitPersonModalComponent, {
      width: '40%',
      data: enteredp
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilterEnteredPersons('');
    });
  }

  enterExpectedVehicle(ev: ExpectedVehicle){
    let dialogRef = this.dialog.open(EnterVehicleModalComponent, {
      width: '40%',
      data: ev
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilterExpectedVehicles('');
    });
  }

  exitEnteredVehicle(enteredv: EnteredVehicle){
    let dialogRef = this.dialog.open(ExitVehicleModalComponent, {
      width: '40%',
      data: enteredv
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilterEnteredVehicles('');
    });
  }

  // spliceExpectedPersons(personRequestId) {
  //   for(let i = 0; i<this.expectedPersons.length; i++){
  //     if(this.expectedPersons[i].requestPersonId == personRequestId){
  //       this.expectedPersons.splice(i, 1);
  //     }
  //   }
  // }

  applyFilterExpectedPersons(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceExpectedPersons.filter = filterValue;
  }

  applyFilterEnteredPersons(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceEnteredPersons.filter = filterValue;
  }

  applyFilterExpectedVehicles(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceExpectedVehicles.filter = filterValue;
  }

  applyFilterEnteredVehicles(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceEnteredVehicles.filter = filterValue;
  }

}
