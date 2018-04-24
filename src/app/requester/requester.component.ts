import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.css']
})
export class RequesterComponent implements OnInit, OnDestroy {

  hoveredEditPerson = false;

  // companies = this.resources.getCompanies();
  companies = this.resources.companies.getCompaniesNames();

  displayedPersonColumns = ['name', 'surname'];
  displayedVehicleColumns = ['model', 'plate'];

  filteredCompanies: Observable<string[]>;

  requesterForm: FormGroup;
  request = new Requester();

  validForm = true;
  editMode: boolean = false;

  paramsSub: any;
  id: number = null;

  constructor(private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              public requesterService: RequesterService,
              private route: ActivatedRoute,
              private resources: ResourcesService) { }

  ngOnInit() {

    this.paramsSub = this.route.params.subscribe(params => {
      if(params['id'] && this.requesterService.getRequest(+params['id']) !== undefined){
        this.id = +params['id'];
        this.editMode = true;
        this.request = this.requesterService.getRequest(this.id);
        this.requesterService.setPersons(this.request.persons);
        // this.requesterService.setVehicles(this.request.vehicles);
        this.resources.vehicles.setVehicles(this.request.vehicles);
      }
    });

    this.requesterForm = new FormGroup({
      'requesterName': new FormControl(this.request.requesterName, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterDescription': new FormControl(this.request.description, {
        updateOn: 'change'
      }),
      'requesterCompany': new FormControl(this.request.company, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterFromDate': new FormControl(this.request.from, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterToDate': new FormControl(this.request.to, {
        validators: Validators.required,
        updateOn: 'change'
      }),
      'requesterNumOfEntries': new FormControl(this.request.numEntries, {
        validators: [Validators.required, this.intValidator]
      })
    })

      this.filteredCompanies = this.requesterForm.controls['requesterCompany'].valueChanges
        .pipe(
          startWith(''),
          map(company => this.filterCompanies(company))
        );
    // this.requesterForm.controls['requesterCompany']
  }

  onSubmit() {
    if(this.requesterForm.valid) {
      if(this.editMode){
        this.request.requesterName = this.requesterForm.controls['requesterName'].value;
        this.request.description = this.requesterForm.controls['requesterDescription'].value;
        this.request.company = this.requesterForm.controls['requesterCompany'].value;
        this.request.from = this.requesterForm.controls['requesterFromDate'].value;
        this.request.to = this.requesterForm.controls['requesterToDate'].value;
        this.request.numEntries = this.requesterForm.controls['requesterNumOfEntries'].value;
        this.requesterService.editRequest(this.request);
      } else {
        this.requesterService.pushRequest(
          this.requesterForm.controls['requesterName'].value,
          this.requesterForm.controls['requesterDescription'].value,
          this.requesterForm.controls['requesterCompany'].value,
          this.requesterForm.controls['requesterFromDate'].value,
          this.requesterForm.controls['requesterToDate'].value,
          this.requesterForm.controls['requesterNumOfEntries'].value
        );
      }
    }
    // this.requesterForm.reset();
    this.requesterForm.controls['requesterName'].setValue('');
    this.requesterForm.controls['requesterName'].markAsPristine();
    this.requesterForm.controls['requesterName'].markAsUntouched();
    this.requesterForm.controls['requesterDescription'].setValue('');
    this.requesterForm.controls['requesterDescription'].markAsPristine();
    this.requesterForm.controls['requesterDescription'].markAsUntouched();
    this.requesterForm.controls['requesterCompany'].setValue('');
    this.requesterForm.controls['requesterCompany'].markAsPristine();
    this.requesterForm.controls['requesterCompany'].markAsUntouched();
    this.requesterForm.controls['requesterFromDate'].setValue('');
    this.requesterForm.controls['requesterFromDate'].markAsPristine();
    this.requesterForm.controls['requesterFromDate'].markAsUntouched();
    this.requesterForm.controls['requesterToDate'].setValue('');
    this.requesterForm.controls['requesterToDate'].markAsPristine();
    this.requesterForm.controls['requesterToDate'].markAsUntouched();
    this.requesterForm.controls['requesterNumOfEntries'].setValue('');
    this.requesterForm.controls['requesterNumOfEntries'].markAsPristine();
    this.requesterForm.controls['requesterNumOfEntries'].markAsUntouched();
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
    // let v = this.requesterService.getVehicleByIndex(index);
    let v = this.resources.vehicles.getVehicleByIndex(index);
    let editVehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw',
      data: {vehicle: v, index: index}
    })
  }

  deleteVehicle(index: number) {
    // this.requesterService.deleteVehicle(index);
    this.resources.vehicles.deleteVehicle(index);
  }

  openVehicleDialog() {
    let vehicleDialogRef = this.dialog.open(DialogVehicleComponent, {
      width: '45vw'
    });

  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }


}
