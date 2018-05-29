import { Component, OnInit } from '@angular/core';
import { GatesService } from '../../services/gates.service';
import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute } from '@angular/router';
import { EnteredPerson } from '../../models/EnteredPerson.model';
import { EnteredVehicle } from '../../models/EnteredVehicle.model';
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
      width: '70%',
      data: {gid: this.gid, ep: ep}
    });

    dialogRef.afterClosed().subscribe(a => {
      if((a != undefined) && (a != null)){
        this.enteredPersons = a.personsInside;
        this.dataSourceEnteredPersons = new MatTableDataSource<EnteredPerson>(this.enteredPersons);
        this.spliceExpectedPersons(a.personId);
      }
      this.applyFilterExpectedPersons('');
      this.applyFilterEnteredPersons('');
    });
  }

  exitEnteredPerson(enteredp: EnteredPerson) {
    let dialogRef = this.dialog.open(ExitPersonModalComponent, {
      width: '70%',
      data: {ep: enteredp, gid: this.gid }
    });

    dialogRef.afterClosed().subscribe(a => {
      if((a != undefined) && (a != null)){
        this.expectedPersons = a.expectedPersons;
        this.dataSourceExpectedPersons = new MatTableDataSource<ExpectedPerson>(this.expectedPersons);
        this.spliceExitedPersons(a.id);
      }
      this.applyFilterEnteredPersons('');
      this.applyFilterExpectedPersons('');
    });
  }

  enterExpectedVehicle(ev: ExpectedVehicle){
    let dialogRef = this.dialog.open(EnterVehicleModalComponent, {
      width: '70%',
      data: {gid: this.gid, exv : ev}
    });

    dialogRef.afterClosed().subscribe(a => {
      if((a != undefined) && (a != null)){
        // this.enteredPersons = a.personsInside;
        // this.dataSourceEnteredPersons = new MatTableDataSource<EnteredPerson>(this.enteredPersons);
        // this.spliceExpectedPersons(a.personId);
      }
      this.applyFilterExpectedVehicles('');
      this.applyFilterEnteredVehicles('');    
    });
  }

  exitEnteredVehicle(enteredv: EnteredVehicle){
    let dialogRef = this.dialog.open(ExitVehicleModalComponent, {
      width: '70%',
      data: enteredv
    });

    dialogRef.afterClosed().subscribe(a => {
      this.applyFilterEnteredVehicles('');
    });
  }

  spliceExpectedPersons(personRequestId) {
    for(let i = 0; i<this.expectedPersons.length; i++){
      if(this.expectedPersons[i].requestPersonId == personRequestId){
        this.expectedPersons.splice(i, 1);
      }
    }
  }

  spliceExitedPersons(personId) {
    for(let i = 0; i<this.enteredPersons.length; i++){
      if(this.enteredPersons[i].id == personId){
        this.enteredPersons.splice(i, 1);
      }
    }
  }

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
