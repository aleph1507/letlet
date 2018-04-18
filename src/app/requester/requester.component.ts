import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Person } from '../models/Person.model';
import { Vehicle } from '../models/Vehicle.model';
import { Requester } from '../models/Requester.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { DialogPersonComponent } from './dialog-person/dialog-person.component';
import { DialogVehicleComponent } from './dialog-vehicle/dialog-vehicle.component';
import { MatDialog } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import "rxjs/add/observable/of";
import { RequesterService } from '../services/requester.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.css']
})
export class RequesterComponent implements OnInit {

  hoveredEditPerson = false;

  // companies = [
  //   {
  //     name: 'AMC'
  //   },
  //   {
  //     name: 'BBC'
  //   },
  //   {
  //     name: 'TAV'
  //   },
  //   {
  //     name: 'DrinkLab'
  //   }
  // ];

  companies = ['AMC', 'BBC', 'TAV', 'DrinkerLab'];

  // persons: Observable<Person[]>;
  // persons: Person[] = [];
  // vehicles: Vehicle[] = [];

  displayedPersonColumns = ['name', 'surname'];
  displayedVehicleColumns = ['model', 'plate'];

  filteredCompanies: Observable<string[]>;

  requesterForm: FormGroup;
  request = new Requester();

  validForm = true;

  constructor(private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              public requesterService: RequesterService) { }

  ngOnInit() {
    this.requesterForm = new FormGroup({
      'requesterName': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterDescription': new FormControl('', {
        updateOn: 'change'
      }),
      'requesterCompany': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterFromDate': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterToDate': new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterNumOfEntries': new FormControl('', {
        validators: [Validators.required, this.intValidator]
      })
    })

    // this.filteredCompanies = this.requesterForm.controls['requesterCompany'].valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(company => company ? this.filterCompanies(company) : this.companies.slice())
    //   )

      this.filteredCompanies = this.requesterForm.controls['requesterCompany'].valueChanges
        .pipe(
          startWith(''),
          map(company => this.filterCompanies(company))
        );
    // this.requesterForm.controls['requesterCompany']
  }

  onSubmit() {
    if(this.requesterForm.valid) {
      this.requesterService.pushRequest(
        this.requesterForm.controls['requesterName'].value,
        this.requesterForm.controls['requesterDescription'].value,
        this.requesterForm.controls['requesterCompany'].value,
        this.requesterForm.controls['requesterFromDate'].value,
        this.requesterForm.controls['requesterToDate'].value,
        this.requesterForm.controls['requesterNumOfEntries'].value
      );
    }
    this.requesterForm.reset();
  }

  filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  intValidator(control: FormControl) {
    return isNaN(control.value) ? { "error": "NaN" } : null;
  }

  openPersonDialog() {
    let personDialogRef = this.dialog.open(DialogPersonComponent, {
      width: '45vw'
    });
  }

  editPerson(index: number){
    let p = this.requesterService.getPersonByIndex(index);
    let editPersonDialogRef = this.dialog.open(DialogPersonComponent, {
      width: '45wv',
      data: {person: p, index: index},
    });

  }

  deletePerson(index: number){
    this.requesterService.deletePerson(index);
  }

  editVehicle(index: number){
    let v = this.requesterService.getVehicleByIndex(index);
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {vehicle: v, index: index}
    })
  }

  deleteVehicle(index: number) {
    this.requesterService.deleteVehicle(index);
  }

  openVehicleDialog() {
    let vehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw'
    });

  }

}
